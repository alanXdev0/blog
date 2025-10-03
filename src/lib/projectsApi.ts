import { decode } from "he";
import { wordpressFetch, resolveAssetUrl, useMockData } from "@/lib/apiClient";
import type { Project } from "@/types/content";
import { mockProjects } from "@/lib/mockData";

interface WordpressRenderableField {
  rendered?: string;
}

interface WordpressProjectResponse {
  id: number;
  slug: string;
  status?: string;
  link?: string;
  menu_order?: number;
  content?: WordpressRenderableField;
  title?: WordpressRenderableField;
  meta?: Record<string, unknown>;
  _embedded?: {
    "wp:featuredmedia"?: unknown[];
  };
}

interface WordpressMediaResponse {
  source_url?: string;
}

const stripHtml = (html?: string | null) => {
  if (!html) {
    return "";
  }
  const withoutTags = html.replace(/<[^>]*>/g, " ");
  return decode(withoutTags.replace(/\s+/g, " ").trim());
};

const parseStringArray = (value: unknown): string[] => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry));
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((entry) => String(entry));
      }
    } catch {
      return value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    }
  }
  return [];
};

const isMedia = (value: unknown): value is WordpressMediaResponse => typeof value === "object" && value !== null;

const extractFeaturedImage = (embedded: WordpressProjectResponse["_embedded"]) => {
  if (!embedded || !Array.isArray(embedded["wp:featuredmedia"])) {
    return "";
  }
  const media = (embedded["wp:featuredmedia"] as unknown[]).find(isMedia) as WordpressMediaResponse | undefined;
  return resolveAssetUrl(media?.source_url ?? "");
};

const mapWordpressProject = (project: WordpressProjectResponse): Project => {
  const meta = project.meta ?? {};
  const link = meta["project_link"];
  const sortOrderValue = meta["project_sort_order"] ?? project.menu_order ?? 0;
  const tagsValue = meta["project_tags"] ?? meta["project_tech_stack"];
  const techStackValue = meta["project_tech_stack"] ?? meta["project_tags"];
  const statusValue = meta["project_status"] ?? project.status;

  return {
    id: String(project.id),
    name: decode(stripHtml(project.title?.rendered ?? project.slug ?? "")) || project.slug,
    description: stripHtml(project.content?.rendered ?? (typeof meta["project_description"] === "string" ? (meta["project_description"] as string) : "")),
    link: typeof link === "string" && link.length > 0 ? link : project.link ?? "",
    image: extractFeaturedImage(project._embedded) || resolveAssetUrl(typeof meta["project_image"] === "string" ? (meta["project_image"] as string) : ""),
    tags: parseStringArray(tagsValue),
    techStack: parseStringArray(techStackValue),
    status: typeof statusValue === "string" ? statusValue : "published",
    sortOrder: Number(sortOrderValue) || 0,
  };
};

export const fetchProjects = async () => {
  if (useMockData) {
    return mockProjects.map((project) => ({
      ...project,
      image: resolveAssetUrl(project.image),
    }));
  }

  const wordpressProjects = await wordpressFetch<WordpressProjectResponse[]>("wp/v2/project", {
    query: {
      status: "publish",
      per_page: 100,
      _embed: "1",
      order: "asc",
      orderby: "menu_order",
    },
  });

  return wordpressProjects
    .map(mapWordpressProject)
    .filter((project) => project.status === "published" || project.status === "publish" || !project.status)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};
