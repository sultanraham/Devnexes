import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  url,
  image,
  type = 'website',
  robots = 'index, follow',
  breadcrumbs = [],
  jsonLd = null,
}) => {
  const siteName = 'Devnexes Digital Solutions';
  const defaultTitle = 'Devnexes Digital Solutions | Web Development, AI Automation & SEO in Lahore';
  const defaultDescription = 'Devnexes Digital Solutions provides cutting-edge web development, AI automation, chatbots, SEO optimization, and UI/UX design to empower startups and enterprises.';
  const defaultKeywords = 'web development, AI automation, full stack development, SEO optimization, UI/UX design, chatbots, Lahore Pakistan, software agency';
  const defaultImage = 'https://www.devnexes.site/images/devnexes-digital-solutions-banner.png';
  const defaultUrl = 'https://www.devnexes.site';

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;
  const seoUrl = url || defaultUrl;

  // Auto-generate BreadcrumbList JSON-LD if breadcrumbs prop is provided
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.devnexes.site"
      },
      ...breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": b.name,
        "item": b.item.startsWith('http') ? b.item : `https://www.devnexes.site${b.item}`
      }))
    ]
  } : null;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="robots" content={robots} />
      <meta name="author" content="Devnexes Digital Solutions" />
      <link rel="canonical" href={seoUrl} />

      {/* Geo Location Tags for Local SEO */}
      <meta name="geo.region" content="PK-PB" />
      <meta name="geo.placename" content="Lahore" />
      <meta name="geo.position" content="31.5204;74.3587" />
      <meta name="ICBM" content="31.5204, 74.3587" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@devnexes" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />

      {/* Breadcrumb Structured Data */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* Custom JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
