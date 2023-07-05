import { time } from 'console';

const endPoint = import.meta.env.VITE_SERVER_ENDPOINT;

export const fetchHomeData = (isDelivery: any, long: any, lat: any) => {
  const now = new Date();
  localStorage.setItem(
    'home_data_at',
    Math.floor(now.getTime() / 1000).toString()
  );
  return fetch(`${endPoint}/get_home_page_data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      delivery: isDelivery,
      long: long,
      lat: lat,
    }),
  }).then((response) => {
    return response;
  });
};
