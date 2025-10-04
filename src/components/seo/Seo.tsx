import { Helmet } from "react-helmet-async";
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
  const uniqueTags = Array.from(new Set(tags.filter(Boolean)));

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="author" content={SITE_OWNER} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={pageTitle} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />

      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
      {type === "article" ? (
        <meta property="article:author" content={SITE_OWNER} />
      ) : null}
      {type === "article"
        ? uniqueTags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))
        : null}
    </Helmet>
  );
};
