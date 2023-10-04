import { api } from '../axiosApi';

async function getAdressByid(id: number) {
    try {
        const response = await api.get("GetClientAddress/" + id,);
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}

async function getDistance(formData: any) {
    try {
        const response = await api.post("getdistance/", formData);
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}



// getDistance(formData: any) {
//     return this.http.post(`${this.url}/getdistance`,formData, { observe: 'response' });
//   }

export const adressService = {
    getAdressByid,
    getDistance,
};
