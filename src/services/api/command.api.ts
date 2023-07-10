import { api } from '../axiosApi';

async function myCommands() {
    try {
        const response = await api.get(
            "mycommands"
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        console.error('Error', error);
        throw error;
    }
}

export const commandService = { myCommands };
