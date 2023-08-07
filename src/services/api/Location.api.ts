import { toast } from "react-toastify";
import { useAppDispatch } from "../../Redux/store";

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
            toast.error(err.message);
        }
    }

    return null; // Return null if latitude or longitude is missing
};



export const LocationService = {
    geoCode
};
