import axios from 'axios';
import express from 'express';
import fs from 'node:fs/promises';
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// Constants
const isProduction = process.env.VITE_NODE_ENV === 'production'
const port = process.env.PORT || 8000
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''
const ssrManifest = isProduction
  ? await fs.readFile('./dist/client/ssr-manifest.json', 'utf-8')
  : undefined

// Create http server
const app = express()
app.use(express.static('./dist/server/assets'))
// Add Vite or respective production middlewares
let vite
if (!isProduction) {
  const { createServer } = await import('vite')
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base
  })
  app.use(vite.middlewares)
} else {
  const compression = (await import('compression')).default
  const sirv = (await import('sirv')).default
  app.use(compression())
  app.use(base, sirv('./dist/client', { extensions: [] }))
}
// get styls
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const resolve = (p) => path.resolve(__dirname, p);

const getStyleSheets = async () => {
  try {
    const assetpath = resolve("dist/client/assets");
    const files = await fs.readdir(assetpath);
    const cssAssets = files.filter(l => l.endsWith(".css"));
    const allContent = [];
    for (const asset of cssAssets) {
      const content = await fs.readFile(path.join(assetpath, asset), "utf-8");
      allContent.push(`<style type="text/css">${content}</style>`);
    }
    return allContent.join("\n");
  } catch (e) {
    console.log("error css ", e)
    return "";
  }
};
const getScripts = async () => {
  try {
    const assetpath = resolve("dist/client/assets");
    const files = await fs.readdir(assetpath);
    const cssAssets = files.filter(l => l.endsWith(".js"));
    const allContent = [];
    for (const asset of cssAssets) {
      const content = await fs.readFile(path.join(assetpath, asset), "utf-8");
      // <style type="text/css">${content}</style>
      // <script type="module" src="/src/entry-client.tsx"></script>
      allContent.push(`
      <script type="module" src="${asset}" async> 
      </script>
      `);
      // <script>
      // ${content}
      // </script>
    }
    return allContent.join("\n");
  } catch (e) {
    console.log("error js ", e)
    return "";
  }
};


const baseTemplate = await fs.readFile(isProduction ? resolve("dist/client/index.html") : resolve("index.html"), "utf-8");
const productionBuildPath = path.join(__dirname, "dist/entry-server.js");
const devBuildPath = path.join(__dirname, "src/entry-server.tsx");
const buildModule = isProduction ? productionBuildPath : devBuildPath;
const { render } = await vite.ssrLoadModule(buildModule);
const stylesheets = getStyleSheets();

// Serve HTML

const ssrHome = async () => {
  const body = {
    delivery: 1,
    long: 10.6088898,
    lat: 35.8466943,
  };
  const { data } = await axios.post('https://api.thunder.webify.pro/api/get_home_page_data', body);
  // console.log(data)
  return data
}

const prepareTemplate = async (req, res) => {
  try {
    // console.log(req.originalUrl)
    const data = await ssrHome()
    const url = req.originalUrl
    const template = await vite.transformIndexHtml(url, baseTemplate);
    const cssAssets = await stylesheets;
    const appHtml = await render(url, data.data);
    const scripts = getScripts();
    const jsAssets = await scripts;
    const html = template
      .replace(`<!--app-head-->`, cssAssets)
      .replace(`<!--app-html-->`, appHtml.html ?? "")
    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
}

app.use('*', (req, res) => prepareTemplate(req, res))

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})




