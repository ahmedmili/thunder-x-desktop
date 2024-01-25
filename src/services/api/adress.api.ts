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
        const response = await api.post("getdistance", formData);
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}

async function deleteAdresse(id: number) {
    try {
        const response = await api.delete("deleteAddresse/" + id);
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}




// deleteAdresse(id:any){
//     return this.http.delete(`${this.url}/deleteAddresse/`+id,{ observe: 'response' });
//   }
export const adressService = {
    getAdressByid,
    getDistance,
    deleteAdresse,
};
