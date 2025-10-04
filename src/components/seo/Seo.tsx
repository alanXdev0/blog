import { useEffect, useMemo } from "react";
import { DEFAULT_SEO, SITE_NAME, SITE_URL, SITE_OWNER } from "@/constants/seo";

export type SeoProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noIndex?: boolean;
};

type RestorableNode<T extends Element> = {
  element: T;
  parent: (Node & ParentNode) | null;
  nextSibling: ChildNode | null;
};

const detachNodes = <T extends Element>(elements: T[]): RestorableNode<T>[] =>
  elements.map((element) => {
    const parent = element.parentNode as (Node & ParentNode) | null;
    const nextSibling = element.nextSibling;

    if (parent) {
      parent.removeChild(element);
    }

    return { element, parent, nextSibling };
  });

const restoreNodes = <T extends Element>(records: RestorableNode<T>[]) => {
  records.forEach(({ element, parent, nextSibling }) => {
    if (!parent) {
      return;
    }

    if (nextSibling && nextSibling.parentNode === parent) {
      parent.insertBefore(element, nextSibling);
    } else {
      parent.appendChild(element);
    }
  });
};

const ensureAbsoluteUrl = (value?: string) => {
  if (!value) {
    return SITE_URL;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const base = SITE_URL.replace(/\/$/, "");
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${base}${path}`;
};

export const Seo = ({
  title,
  description,
  canonical,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  tags = [],
  noIndex = false,
}: SeoProps) => {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_SEO.title;
  const pageDescription = description ?? DEFAULT_SEO.description;
  const canonicalUrl = ensureAbsoluteUrl(canonical);
  const imageUrl = ensureAbsoluteUrl(image ?? DEFAULT_SEO.image);
  const robots = noIndex ? "noindex, nofollow" : "index, follow";
  const uniqueTags = useMemo(
    () => Array.from(new Set(tags.filter(Boolean))),
    [tags],
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const cleanups: Array<() => void> = [];

    const replaceMeta = (
      attr: "name" | "property",
      key: string,
      value?: string,
    ) => {
      const selector = `meta[${attr}="${key}"]`;
      const existing = Array.from(
        document.head.querySelectorAll(selector),
      ) as HTMLMetaElement[];
      const removed = detachNodes(existing);

      let created: HTMLMetaElement | null = null;

      if (value) {
        created = document.createElement("meta");
        created.setAttribute(attr, key);
        created.setAttribute("content", value);
        document.head.appendChild(created);
      }

      cleanups.push(() => {
        if (created?.isConnected) {
          created.remove();
        }

        restoreNodes(removed);
      });
    };

    const replaceLink = (rel: string, href?: string) => {
      const selector = `link[rel="${rel}"]`;
      const existing = Array.from(
        document.head.querySelectorAll(selector),
      ) as HTMLLinkElement[];
      const removed = detachNodes(existing);

      let created: HTMLLinkElement | null = null;

      if (href) {
        created = document.createElement("link");
        created.setAttribute("rel", rel);
        created.setAttribute("href", href);
        document.head.appendChild(created);
      }

      cleanups.push(() => {
        if (created?.isConnected) {
          created.remove();
        }

        restoreNodes(removed);
      });
    };

    const replaceMetaList = (
      attr: "name" | "property",
      key: string,
      values: string[],
    ) => {
      const selector = `meta[${attr}="${key}"]`;
      const existing = Array.from(
        document.head.querySelectorAll(selector),
      ) as HTMLMetaElement[];
      const removed = detachNodes(existing);

      const created = values.map((value) => {
        const element = document.createElement("meta");
        element.setAttribute(attr, key);
        element.setAttribute("content", value);
        document.head.appendChild(element);
        return element;
      });

      cleanups.push(() => {
        created.forEach((element) => {
          if (element.isConnected) {
            element.remove();
          }
        });

        restoreNodes(removed);
      });
    };

    const previousTitle = document.title;
    document.title = pageTitle;

    cleanups.push(() => {
      document.title = previousTitle;
    });

    replaceMeta("name", "description", pageDescription);
    replaceMeta("name", "author", SITE_OWNER);
    replaceMeta("name", "robots", robots);
    replaceMeta("name", "googlebot", robots);
    replaceLink("canonical", canonicalUrl);

    replaceMeta("property", "og:site_name", SITE_NAME);
    replaceMeta("property", "og:type", type);
    replaceMeta("property", "og:title", pageTitle);
    replaceMeta("property", "og:description", pageDescription);
    replaceMeta("property", "og:url", canonicalUrl);
    replaceMeta("property", "og:image", imageUrl);
    replaceMeta("property", "og:image:alt", pageTitle);

    replaceMeta("name", "twitter:card", "summary_large_image");
    replaceMeta("name", "twitter:title", pageTitle);
    replaceMeta("name", "twitter:description", pageDescription);
    replaceMeta("name", "twitter:image", imageUrl);

    replaceMeta(
      "property",
      "article:published_time",
      type === "article" ? publishedTime : undefined,
    );
    replaceMeta(
      "property",
      "article:modified_time",
      type === "article" ? modifiedTime : undefined,
    );
    replaceMeta(
      "property",
      "article:author",
      type === "article" ? SITE_OWNER : undefined,
    );
    replaceMetaList(
      "property",
      "article:tag",
      type === "article" ? uniqueTags : [],
    );

    return () => {
      cleanups.reverse().forEach((cleanup) => {
        try {
          cleanup();
        } catch {
          // ignore cleanup failures
        }
      });
    };
  }, [
    pageTitle,
    pageDescription,
    canonicalUrl,
    imageUrl,
    robots,
    type,
    publishedTime,
    modifiedTime,
    uniqueTags,
  ]);

  return null;
};
