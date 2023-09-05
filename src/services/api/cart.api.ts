import { api } from '../axiosApi';

async function createOrder(order: any) {
    try {
        const response = await api.post(
            "createcommand",
            order,
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

async function getAllPromoCodes() {
    try {
        const response = await api.get(
            "/mycoupons",
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

async function getGift(formData: any) {
    try {
        const response = await api.post(
            "/getclientGift",
            formData,
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

 const  getPromoCode = async (formData: any) => { //code_coupon

    try {
        const response = await api.post(
            "/update_tentative",
            formData,
        );
        const { status, data } = response;

        return { status, data };
    } catch (error) {
        return {status:422 , data:{}}
       
    }
}
 


export const cartService = {
    createOrder,
    getAllPromoCodes,
    getGift,
    getPromoCode,
};
