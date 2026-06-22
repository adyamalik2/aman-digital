import type { Metadata } from "next";

const OG_IMAGE = "/images/og-image.png";

/**
 * Builds a complete Metadata object (title, description, canonical, OpenGraph,
 * Twitter card) for a marketing page — mirrors the per-page meta tags from the
 * old static site. metadataBase is set in the root layout so relative URLs
 * resolve to https://amandigital.my.id.
 */
export function pageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "AMAN Digital",
      locale: "id_ID",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}
