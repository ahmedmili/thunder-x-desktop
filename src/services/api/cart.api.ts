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
export const cartService = { createOrder };
