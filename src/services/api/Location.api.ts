// import { toast } from "react-toastify";
import { api } from "../axiosApi";

const googleMapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const geoCode = async (latitude: any, longitude: any) => {
    if (latitude && longitude) {
        try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapKey}`;

            const response = await fetch(url);  // Use await to fetch data
            const data = await response.json(); // Use await to parse JSON data

            const dispatchData = {
                coords: {
                    latitude: latitude,
                    longitude: longitude,
                    label: data?.results.length
                        ? data.results[0].formatted_address // Use index 0 instead of 1
                        : null,
                },
            };

            return dispatchData; // Return the data within the async function

        } catch (err: any) {
            // toast.error(err.message);
        }
    }

    return null; // Return null if latitude or longitude is missing
};

async function addaddresse(data: any) {
    const formData = new FormData();
    formData.append("long", data.long);
    formData.append("lat", data.lat);
    formData.append("appartement", data.appartement);
    formData.append("door", data.door);
    formData.append("flat", data.flat);
    formData.append("label", data.label);
    formData.append("type", data.type);
    formData.append("primary", data.primary);
    try {
      const response = await api.post("addaddresse", formData);
      const { status, data } = response;
      return { status, data };
    } catch (error) {
      throw error;
    }
  }

async function autocomplete(data: string) {
    const term = {
        term : data
    }
    try {
      const response = await api.post("autocomplete", term);
      const { status, data } = response;
      return { status, data };
    } catch (error) {
      throw error;
    }
  }

export const LocationService = {
    geoCode,
    addaddresse,
    autocomplete,
};
