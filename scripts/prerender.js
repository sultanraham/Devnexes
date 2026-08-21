import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');
const publicPath = path.resolve(__dirname, '../public');

const routes = [
  '/',
  '/about',
  '/contact',
  '/portfolio',
  '/policy',
  '/team/muhammad-raham-abdul-qayyum',
  '/team/muhammad-arham-abdul-qayyum',
  '/team/huzaifa-ali',
  '/team/huzaifa-mushtaq',
  '/team/muhammad-habeel'
];

async function runPrerender() {
  console.log('🚀 Starting Universal Prerendering Pipeline...');

  let templateHtml;
  try {
    templateHtml = await fs.readFile(path.join(distPath, 'index.html'), 'utf-8');
  } catch (err) {
    console.error('❌ Failed to read dist/index.html. Run vite build first.');
    process.exit(1);
  }

  // Initialize Vite in SSR mode to load React components on the fly
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const { translations } = await vite.ssrLoadModule('/src/translations.js');
    const { default: AboutPage } = await vite.ssrLoadModule('/src/components/AboutPage.jsx');
    const { default: ContactSection } = await vite.ssrLoadModule('/src/components/ContactSection.jsx');
    const { default: PortfolioPage } = await vite.ssrLoadModule('/src/components/PortfolioPage.jsx');
    const { default: PolicyPage } = await vite.ssrLoadModule('/src/components/PolicyPage.jsx');
    const { default: TeamMemberPage } = await vite.ssrLoadModule('/src/components/TeamMemberPage.jsx');
    const { default: Hero } = await vite.ssrLoadModule('/src/components/Hero.jsx');
    const { default: Features } = await vite.ssrLoadModule('/src/components/Features.jsx');
    const { default: DigitalGrowth } = await vite.ssrLoadModule('/src/components/DigitalGrowth.jsx');
    const { default: TrustedClients } = await vite.ssrLoadModule('/src/components/TrustedClients.jsx');
    const { default: VideoSection } = await vite.ssrLoadModule('/src/components/VideoSection.jsx');
    const { default: DownloadSection } = await vite.ssrLoadModule('/src/components/DownloadSection.jsx');
    const { default: FAQSection } = await vite.ssrLoadModule('/src/components/FAQSection.jsx');
    const { default: CustomerSupport } = await vite.ssrLoadModule('/src/components/CustomerSupport.jsx');
    const { default: Footer } = await vite.ssrLoadModule('/src/components/Footer.jsx');
    const { default: SEO } = await vite.ssrLoadModule('/src/components/SEO.jsx');

    const t = translations.EN;

    const getElementForRoute = (route) => {
      if (route === '/') {
        return React.createElement(React.Fragment, null,
          React.createElement(SEO, {
            title: "Web Development, AI Automation & SEO Solutions",
            description: "Devnexes Digital Solutions builds custom web applications, AI chatbots, automation workflows, and high-ranking SEO strategies for businesses globally.",
            keywords: "web development Lahore, AI automation Pakistan, custom software agency, chatbots, React web app, SEO services",
            url: "https://www.devnexes.site/"
          }),
          React.createElement(Hero, { t: t.hero }),
          React.createElement(Features, { t: t.features }),
          React.createElement(DigitalGrowth, { t: t.growth }),
          React.createElement(TrustedClients, { t: t.clients }),
          React.createElement(VideoSection, { t: t.features }),
          React.createElement(DownloadSection, { t: t.download }),
          React.createElement(FAQSection, { t: t.faq }),
          React.createElement(CustomerSupport, { t: t.support }),
          React.createElement(Footer, { t: t.hero })
        );
      }
      if (route === '/about') return React.createElement(AboutPage, { t: t.about || {} });
      if (route === '/contact') return React.createElement(ContactSection, { t: t.hero });
      if (route === '/portfolio') return React.createElement(PortfolioPage);
      if (route === '/policy') return React.createElement(PolicyPage);
      if (route.startsWith('/team/')) {
        return React.createElement(Routes, null,
          React.createElement(Route, { path: '/team/:slug', element: React.createElement(TeamMemberPage) })
        );
      }
      return null;
    };

    const sitemapUrls = [];
    const date = new Date().toISOString().split('T')[0];

    for (const route of routes) {
      console.log(`✨ Prerendering route: ${route}`);
      const helmetContext = {};

      const appHtml = renderToString(
        React.createElement(HelmetProvider, { context: helmetContext },
          React.createElement(MemoryRouter, { initialEntries: [route] },
            React.createElement('main', { className: "w-full min-h-screen bg-[#061632] text-white overflow-x-hidden font-sans" },
              getElementForRoute(route)
            )
          )
        )
      );

      const helmet = helmetContext.helmet;
      const headTags = [
        helmet?.title?.toString() || '',
        helmet?.meta?.toString() || '',
        helmet?.link?.toString() || '',
        helmet?.script?.toString() || ''
      ].filter(Boolean).join('\n');

      let finalHtml = templateHtml;
      if (headTags) {
        finalHtml = finalHtml.replace('</head>', `${headTags}\n</head>`);
      }
      finalHtml = finalHtml.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      let outputPath = path.join(distPath, 'index.html');
      if (route !== '/') {
        const routeDir = path.join(distPath, route.slice(1));
        await fs.mkdir(routeDir, { recursive: true });
        outputPath = path.join(routeDir, 'index.html');
      }

      await fs.writeFile(outputPath, finalHtml);
      console.log(`  └─ Saved pre-rendered HTML: ${path.relative(distPath, outputPath)} (${(finalHtml.length / 1024).toFixed(1)} KB)`);

      const priority = route === '/' ? '1.0' : (route.startsWith('/team/') ? '0.7' : '0.8');
      const changefreq = route === '/' ? 'weekly' : 'monthly';
      sitemapUrls.push(`
  <url>
    <loc>https://www.devnexes.site${route}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }

    // Generate Sitemap XML
    console.log('📄 Generating sitemap.xml...');
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('')}
</urlset>`;

    await fs.writeFile(path.join(distPath, 'sitemap.xml'), sitemapXml);
    await fs.writeFile(path.join(publicPath, 'sitemap.xml'), sitemapXml);
    console.log('  └─ Saved sitemap.xml to dist/ & public/');

    console.log('🎉 Universal Prerendering Completed Successfully!');
  } catch (err) {
    console.error('❌ Prerendering Error:', err);
    process.exit(1);
  } finally {
    await vite.close();
  }
}

runPrerender();
