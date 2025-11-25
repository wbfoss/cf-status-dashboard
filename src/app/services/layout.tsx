import { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cf-status.wbfoss.org";

export const metadata: Metadata = {
  title: "Core Services Status",
  description:
    "Monitor Cloudflare core services status including CDN, DNS, SSL, Workers, Pages, R2, D1, Stream, Images, API, and Dashboard. Real-time operational status and incident tracking.",
  keywords: [
    "cloudflare services",
    "cloudflare CDN status",
    "cloudflare DNS status",
    "cloudflare Workers status",
    "cloudflare Pages status",
    "cloudflare R2 status",
    "cloudflare API status",
    "cloudflare Dashboard status",
    "cloudflare SSL status",
  ],
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: "Cloudflare Core Services Status",
    description:
      "Real-time status monitoring for all Cloudflare core services including CDN, DNS, Workers, Pages, and more.",
    url: `${siteUrl}/services`,
  },
  twitter: {
    title: "Cloudflare Core Services Status",
    description:
      "Real-time status monitoring for all Cloudflare core services.",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
