
import { api } from '../axiosApi';

async function all_annonces() {
  try {
    const response = await api.get("all_annonces",);
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

async function searchSupplierByArticle(data: any) {
  const query = data;
  try {
    const response = await api.post("search_supplier", JSON.stringify(query));
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

async function searchSupplierBySubArticle(data: any) {
  const query = data;
  try {
    const response = await api.post("search_supplier_by_cat", JSON.stringify(query));
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}
async function getSupplierById(supplierId: number) {

  try {
    const response = await api.get("getSupplierById/" + supplierId);
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

async function getSupplierISoPENById(supplierId: number) {
  try {
    const response = await api.get("getSupplierIsOpenById/" + supplierId);
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}


async function getSuppliersByCategory(page: number, idCat: number, items: any, keywords: string) {
  try {
    const response = await api.post(`ClientGetSupplierByCategory/${items}?page=${page}`, { category_id: idCat, keyword: keywords });
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

async function getSuppliersIndex(long: number, lat: number, delivery: number = 1, cat: boolean = false) {
  let body: { long: number; lat: number; delivery: number; category_id?: boolean } = { long, lat, delivery };
  if (cat !== false) {
    body['category_id'] = cat;
  }
  try {
    const response = await api.post(`get_home_page_data/`, body);
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}
async function getSuppliersAndAds() {
  try {
    const response = await api.get(`home/index`);
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}


const redAnnonce = (formData: any) => {
  return api.post(`read_annonces`, formData)

}

export const supplierServices = {
  all_annonces,
  searchSupplierByArticle,
  searchSupplierBySubArticle,
  getSupplierById,
  getSupplierISoPENById,
  getSuppliersByCategory,
  getSuppliersIndex,
  getSuppliersAndAds,
  redAnnonce,


};