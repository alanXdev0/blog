import TurndownService from "turndown";
import { decode } from "he";
import { wordpressFetch, resolveAssetUrl, useMockData } from "@/lib/apiClient";
import type { Post, PostCategory, PostTag } from "@/types/content";
import { mockPosts } from "@/lib/mockData";

export interface PostFilterOptions {
  category?: PostCategory;
  featured?: boolean;
  search?: string;
}

interface WordpressRenderableField {
  rendered?: string;
}

interface WordpressTermResponse {
  id?: number;
  slug?: string;
  name?: string;
  description?: string;
}

interface WordpressMediaResponse {
  source_url?: string;
}

interface WordpressPostResponse {
  id: number;
  slug: string;
  status: string;
  sticky?: boolean;
  date_gmt?: string;
  meta?: Record<string, unknown>;
  title?: WordpressRenderableField;
  content?: WordpressRenderableField;
  excerpt?: WordpressRenderableField;
  _embedded?: {
    "wp:term"?: unknown[];
    "wp:featuredmedia"?: unknown[];
  };
}

const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });

turndown.keep(["pre"]);

const htmlToMarkdown = (html?: string | null) => {
  if (!html) {
    return "";
  }
  return turndown.turndown(html);
};

const stripHtml = (html?: string | null) => {
  if (!html) {
    return "";
  }
  const withoutTags = html.replace(/<[^>]*>/g, " ");
  return decode(withoutTags.replace(/\s+/g, " ").trim());
};

const computeReadingTime = (markdown: string) => {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
};

const isTerm = (value: unknown): value is WordpressTermResponse => typeof value === "object" && value !== null;

const toTermGroup = (value: unknown): WordpressTermResponse[] =>
  Array.isArray(value) ? value.filter(isTerm) : [];

const extractTermGroups = (embedded: WordpressPostResponse["_embedded"]) => {
  if (!embedded || !Array.isArray(embedded["wp:term"])) {
    return { categories: [] as WordpressTermResponse[], tags: [] as WordpressTermResponse[] };
  }
  const [categoriesRaw, tagsRaw] = embedded["wp:term"] as unknown[];
  return {
    categories: toTermGroup(categoriesRaw),
    tags: toTermGroup(tagsRaw),
  };
};

const isMedia = (value: unknown): value is WordpressMediaResponse => typeof value === "object" && value !== null;

const extractFeaturedImage = (embedded: WordpressPostResponse["_embedded"]) => {
  if (!embedded || !Array.isArray(embedded["wp:featuredmedia"])) {
    return "";
  }
  const media = (embedded["wp:featuredmedia"] as unknown[]).find(isMedia) as WordpressMediaResponse | undefined;
  return resolveAssetUrl(media?.source_url ?? "");
};

const mapWordpressTags = (tags: WordpressTermResponse[]): PostTag[] =>
  tags
    .map((tag) => ({
      id: tag.id ? String(tag.id) : tag.slug ?? tag.name ?? "",
      name: tag.name ?? tag.slug ?? "",
      color: typeof tag.description === "string" && /^#/u.test(tag.description) ? tag.description : undefined,
    }))
    .filter((tag) => tag.id && tag.name);

const mapWordpressPost = (post: WordpressPostResponse): Post => {
  const { categories, tags } = extractTermGroups(post._embedded);
  const markdownContent = htmlToMarkdown(post.content?.rendered ?? "");
  const excerpt = stripHtml(post.excerpt?.rendered ?? "");
  const readingTime = computeReadingTime(markdownContent);
  const heroImage = extractFeaturedImage(post._embedded);
  const publishedAt = post.date_gmt ? new Date(post.date_gmt).toISOString() : null;

  return {
    id: String(post.id),
    title: decode(stripHtml(post.title?.rendered ?? post.slug ?? "")) || post.slug,
    slug: post.slug,
    excerpt,
    content: markdownContent,
    category: categories[0]?.name ?? "Uncategorized",
    tags: mapWordpressTags(tags),
    heroImage,
    featured: Boolean(post.sticky),
    publishedAt,
    isPublished: post.status === "publish",
    meta: {
      readingTime,
    },
    readingTime,
  };
};

const applyClientFilters = (posts: Post[], filters?: PostFilterOptions) => {
  if (!filters) {
    return posts;
  }
  let filtered = posts;
  if (filters.category) {
    filtered = filtered.filter((post) => post.category === filters.category);
  }
  if (typeof filters.featured === "boolean") {
    filtered = filtered.filter((post) => post.featured === filters.featured);
  }
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter((post) => post.title.toLowerCase().includes(query));
  }
  return filtered;
};

export const fetchPosts = async (filters?: PostFilterOptions) => {
  if (useMockData) {
    let posts = [...mockPosts];
    posts = posts.map((post) => ({ ...post, heroImage: resolveAssetUrl(post.heroImage) }));
    return applyClientFilters(posts, filters);
  }

  const wordpressPosts = await wordpressFetch<WordpressPostResponse[]>("wp/v2/posts", {
    query: {
      status: "publish",
      per_page: 100,
      _embed: "1",
      order: "desc",
      orderby: "date",
    },
  });

  const mapped = wordpressPosts.map(mapWordpressPost).filter((post) => post.isPublished);
  return applyClientFilters(mapped, filters);
};

export const fetchPost = async (idOrSlug: string) => {
  if (useMockData) {
    const post = mockPosts.find((entry) => entry.id === idOrSlug || entry.slug === idOrSlug);
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post, heroImage: resolveAssetUrl(post.heroImage) };
  }

  const baseQuery = { _embed: "1" } as const;

  const numericId = Number(idOrSlug);
  if (!Number.isNaN(numericId) && String(numericId) === idOrSlug) {
    const wordpressPost = await wordpressFetch<WordpressPostResponse>(`wp/v2/posts/${numericId}`, {
      query: baseQuery,
    });
    const mapped = mapWordpressPost(wordpressPost);
    if (!mapped.isPublished) {
      throw new Error("Post not found");
    }
    return mapped;
  }

  const posts = await wordpressFetch<WordpressPostResponse[]>("wp/v2/posts", {
    query: { ...baseQuery, slug: idOrSlug, per_page: 1 },
  });
  const wordpressPost = posts[0];
  if (!wordpressPost) {
    throw new Error("Post not found");
  }
  const mapped = mapWordpressPost(wordpressPost);
  if (!mapped.isPublished) {
    throw new Error("Post not found");
  }
  return mapped;
};
