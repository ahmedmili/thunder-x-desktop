import { api } from '../axiosApi';

async function getProduct(productId: number | undefined) {
    try {
        if (productId === undefined) {
            return { status: undefined, data: undefined };
        }
        const response = await api.get(
            `/getProduct/${productId}`,
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

async function getMenu(supplier_id: string | undefined) {
    try {
        if (supplier_id === undefined) {
            return { status: undefined, data: undefined };
        }
        const response = await api.post(
            "getmenu", { supplier_id: supplier_id },
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

export const productService = { getProduct, getMenu };
