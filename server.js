import axios from 'axios';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs/promises';
import path, { dirname } from "path";
import querystring from 'querystring';
import url, { fileURLToPath } from 'url';

dotenv.config();

// Constants
const isProduction = process.env.VITE_NODE_ENV === 'production'
const port = process.env.PORT || 3212
const base = process.env.BASE || '/'
const sucret_Key = process.env.VITE_CRYPTO_SUCRET_KEY || 'thunder-x-2024'
const apiUrl = 'https://api.thunder.webify.pro/api/'
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
  app.use(base, sirv('./dist/client/assets', { extensions: [] }))
}
// get styls
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const resolve = (p) => path.resolve(__dirname, p);
app.use('/assets', express.static(resolve("dist/client/assets")));

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
    console.error("error css ", e)
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
  const { status, data } = await axios.post(apiUrl + 'get_home_page_data', body);
  return { status, data }
}

async function getSupplierById(supplierId) {
  try {
    const response = await axios.get(apiUrl + "getSupplierById/" + supplierId);
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}

async function getMenu(supplier_id) {
  try {
    if (supplier_id === undefined) {
      return { status: undefined, data: undefined };
    }
    const response = await axios.post(
      apiUrl + "getmenu", { supplier_id: supplier_id },
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}

async function getProduct(supplier_id) {
  try {
    if (supplier_id === undefined) {
      return { status: undefined, data: undefined };
    }
    const response = await axios.get(
      `${apiUrl}getProduct/${supplier_id}`,
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}

const arrayToObject = (array) => {
  const resultObject = {};
  array.forEach((item) => {
    const [key, value] = item.split(':');
    resultObject[key] = value;
  });
  return resultObject
}
const unHashData = (encryptedData, secretKey = sucret_Key) => {
  // Decrypt the data using the secret key
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedData

}

const fetchParams = (query) => {
  let realDataString = unHashData(`${query}`)
  let dataTable = realDataString.replaceAll('=', ":").split("&")
  let resultObject = arrayToObject(dataTable);
  return resultObject
}


const searchSuppliersByFilter = async (query) => {
  if (!query.search) return null
  const search = query.search ? fetchParams(query.search) : {}
  const payload = {
    order_by: search.order ? search.order : "popular",
    max_price: search.max_price ? search.max_price : 100,
    min_price: search.min_price ? search.min_price : 0,
    lat: search.lat ? search.lat : 10.6088898,
    long: search.lng ? search.lng : 35.8466943,
    category_id: search.category ? search.category : "",
    delivery_price: search.delivery_price ? search.delivery_price : 0,
    filter: search.filter ? search.filter : "",
  };
  try {
    const { success, data } = await axios.post(`${apiUrl}search_supplier_filters`, payload);
    return { success, data }
  } catch (error) {
    throw error
  }

}


const prepareTemplate = async (req, res) => {
  try {
    var data
    var reqUrl = req.originalUrl
    switch (true) {
      case (reqUrl === '/'):
        var response = await ssrHome()
        data = response.data
        break;
      case (reqUrl.includes('/restaurant/')):
        let testUrl = reqUrl.split('/')
        var supplierData = testUrl[2]
        var supplier_id = supplierData.split('-')[0]
        if (testUrl[4].length > 0) {
          testUrl[5] = ""
          supplierData = testUrl[2]
          supplier_id = supplierData.split('-')[0]
          testUrl[1] = "product"
          reqUrl = testUrl.join("/")
          let product_id = testUrl[4]

          var supplierResponse = await getSupplierById(supplier_id)
          var productResponse = await getProduct(product_id)
          data = {
            status: 200,
            data: {
              supplierResponse: supplierResponse.data,
              productResponse: productResponse.data,
            }
          }
        } else {
          var supplierResponse = await getSupplierById(supplier_id)
          var menuResponse = await getMenu(supplier_id)
          data = {
            status: 200,
            data: {
              supplierResponse: supplierResponse.data,
              menuResponse: menuResponse.data,
            }
          }
        }
        break;
      case (reqUrl.includes('/product/')):

        break;
      case (reqUrl.includes('/search/')):
        // Assuming req is your Express request object
        const parsedUrl = url.parse(req.originalUrl);
        const queryParams = querystring.parse(parsedUrl.query);

        var response = await searchSuppliersByFilter(queryParams)
        response ?
          data = {
            status: 200,
            data: response.data,

          } :
          data = null
        break;
      default:
        break;
    }

    const template = await vite.transformIndexHtml(reqUrl, baseTemplate);
    const cssAssets = await stylesheets;
    const appHtml = await render(reqUrl, data && data.data);


    const html = template
      .replace(`<!--app-head-->`, cssAssets)
      .replace(`<!--app-html-->`, appHtml.html ?? "")

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.error(e.stack)
    res.status(500).end(e.stack)
  }
}

app.use('*', (req, res) => prepareTemplate(req, res))

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})




