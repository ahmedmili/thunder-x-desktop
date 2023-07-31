
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

export const supplierServices = { all_annonces };