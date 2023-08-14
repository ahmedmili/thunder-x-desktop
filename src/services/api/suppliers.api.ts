
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

export const supplierServices = {
  all_annonces,
  searchSupplierByArticle,
  searchSupplierBySubArticle
};