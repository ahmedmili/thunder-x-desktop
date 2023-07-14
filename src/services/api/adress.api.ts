import { api } from '../axiosApi';

async function getAdressByid(id: number) {
    console.log(id);
    try {
        const response = await api.get("GetClientAddress/"+id,);
        const { status, data } = response;
        console.log(data)
        return { status, data };
    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}
export const adressService = { getAdressByid };
