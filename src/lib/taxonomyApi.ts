import { wordpressFetch, useMockData } from "@/lib/apiClient";
import { DEFAULT_POST_CATEGORIES } from "@/constants/categories";
import { mockPosts } from "@/lib/mockData";

export interface TaxonomyResponse {
  categories: { id: string; name: string }[];
  tags: { id: string; name: string; color?: string | null }[];
}

interface WordpressTermResponse {
  id: number;
  name: string;
  description?: string;
}

const mapCategory = (category: WordpressTermResponse) => ({ id: String(category.id), name: category.name });

const mapTag = (tag: WordpressTermResponse) => ({
  id: String(tag.id),
  name: tag.name,
  color: typeof tag.description === "string" && /^#/u.test(tag.description) ? tag.description : null,
});

export const fetchTaxonomy = async (): Promise<TaxonomyResponse> => {
  if (useMockData) {
    const categories = DEFAULT_POST_CATEGORIES.map((name) => ({ id: name.toLowerCase(), name }));
    const tagMap = new Map<string, { id: string; name: string; color?: string | null }>();
    mockPosts.forEach((post) => {
      post.tags.forEach((tag) => {
        tagMap.set(tag.id, { id: tag.id, name: tag.name, color: tag.color });
      });
    });
    return { categories, tags: Array.from(tagMap.values()) };
  }

  const [categories, tags] = await Promise.all([
    wordpressFetch<WordpressTermResponse[]>("wp/v2/categories", {
      query: { per_page: 100, orderby: "name", order: "asc" },
    }),
    wordpressFetch<WordpressTermResponse[]>("wp/v2/tags", {
      query: { per_page: 100, orderby: "name", order: "asc" },
    }),
  ]);

  return {
    categories: categories.map(mapCategory),
    tags: tags.map(mapTag),
  };
};
