import { api } from '../axiosApi';

async function getHomeData(isDelivery: any, long: any, lat: any) {
  if (!isDelivery || !long || !lat) {
    return { status: undefined, data: undefined };
  }
  const body = {
    delivery: isDelivery,
    long: long,
    lat: lat,
  };
  try {
    const response = await api.post(
      "get_home_page_data",
      body,
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

export const homedataService = { getHomeData };