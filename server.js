import fs from 'node:fs/promises'
import express from 'express'
import ReactDOMServer from "react-dom/server"
import axios from 'axios'
// Constants
const isProduction = process.env.VITE_NODE_ENV === 'Production'
const port = process.env.PORT || 8000
const base = process.env.BASE || '/*'

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
    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<div id="root"></div>`, `
    <noscript> you need to enable Javascript to run this app </noscript> 
      <div className="ssr-hidden" style="display: none;">${rendered.html}</div>
      <div id="root"></div>
      <script>window.__INITIAL_DATA__ = ${JSON.stringify(data.data)}</script>
      `)
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




