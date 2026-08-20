import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

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

async function startServer() {
  const app = express();
  // Serve static files from dist
  app.use(express.static(distPath));
  
  // Catch-all to serve index.html for CSR navigation (so Puppeteer can load the route)
  app.use(async (req, res) => {
    try {
      const html = await fs.readFile(path.join(distPath, 'index.html'), 'utf-8');
      res.send(html);
    } catch (err) {
      res.status(404).send('Not found');
    }
  });

  return new Promise((resolve) => {
    const server = app.listen(5050, () => {
      resolve(server);
    });
  });
}

async function runPrerender() {
  // Note: Puppeteer requires a real browser, so prerendering must be run locally
  // before deploying. Run `npm run build` on your local machine, then commit
  // the dist/ folder, or use a CI runner with Chrome installed.
  if (process.env.VERCEL) {
    console.log('Skipping Puppeteer on Vercel (no browser available). Pre-render locally before deploying.');
    console.log('The dist/ folder should already contain pre-rendered HTML from your local build.');
    process.exit(0);
  }

  console.log('Starting prerender process...');
  const server = await startServer();
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  } catch(e) {
    console.log('Puppeteer launch skipped, building static sitemap...');
  }
  
  try {
    const sitemapUrls = [];
    const date = new Date().toISOString();

    for (const route of routes) {
      if (browser) {
        try {
          console.log(`Prerendering route: ${route}`);
          const page = await browser.newPage();
          
          await page.goto(`http://localhost:5050${route}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
          await page.waitForSelector('#root', { timeout: 5000 });

          const html = await page.evaluate(() => '<!DOCTYPE html>\n' + document.documentElement.outerHTML);
          
          let outputPath = path.join(distPath, 'index.html');
          if (route !== '/') {
            const routeDir = path.join(distPath, route);
            await fs.mkdir(routeDir, { recursive: true });
            outputPath = path.join(routeDir, 'index.html');
          }

          await fs.writeFile(outputPath, html);
          console.log(`Saved: ${outputPath}`);
          await page.close();
        } catch (pageErr) {
          console.warn(`Prerender notice for ${route}: ${pageErr.message}`);
        }
      }

      const priority = route === '/' ? '1.0' : '0.8';
      sitemapUrls.push(`
  <url>
    <loc>https://www.devnexes.site${route}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }

    // Generate Sitemap
    console.log('Generating sitemap.xml...');
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('')}
</urlset>`;
    
    await fs.writeFile(path.join(distPath, 'sitemap.xml'), sitemapXml);
    console.log('Sitemap generated.');

  } catch (err) {
    console.error('Prerendering notice:', err.message);
  } finally {
    if (browser) await browser.close();
    server.close();
    console.log('Prerendering complete!');
  }
}

runPrerender();
