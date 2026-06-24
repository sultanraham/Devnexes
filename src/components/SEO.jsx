import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, image }) => {
  const siteName = 'Devnexes Digital Solutions';
  const defaultTitle = 'Devnexes | Custom Web & AI Solutions';
  const defaultDescription = 'Devnexes Digital Solutions (Private) Limited provides cutting-edge web development, mobile app development, and AI-powered automation to drive business growth.';
  const defaultImage = 'https://www.devnexes.site/images/og-image.jpg';
  const defaultUrl = 'https://www.devnexes.site';

  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url || defaultUrl;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seoUrl} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};

export default SEO;
