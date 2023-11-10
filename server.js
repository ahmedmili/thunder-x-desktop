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



// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')
    let template
    let render
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8')
      template = await vite.transformIndexHtml(url, template)
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
    } else {
      template = templateHtml
      render = (await import('./dist/server/entry-server.js')).render
    }

    const rendered = await render(url)
    const data = await axios.post('https://api.thunder.webify.pro/api/get_home_page_data', {
      delivery: '0',
      lat: '35.8491583',
      long: '10.5858895'
    })

    const stylesheets = getStyleSheets();
    const cssAssets = await stylesheets;
    const html = template
      .replace(`<!--app-head-->`, (rendered.head ?? "") + (cssAssets ?? ''))
      .replace(`<!--app-html-->`, rendered.html)
    // <script>window.__INITIAL_DATA__ = ${JSON.stringify(data.data)}</script>
    setTimeout(
      () =>
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      , 700
    )
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})




