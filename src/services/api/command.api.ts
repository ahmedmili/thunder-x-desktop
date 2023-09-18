import { api } from '../axiosApi';

async function myCommands() {
    try {
        const response = await api.get(
            "mycommands"
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}
async function passedCommands() {
    try {
        const response = await api.get(
            "mycommandspassed"
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}
async function removecommand(command_id: number) {
    try {
        const response = await api.post(
            "removecommand", { command_id: command_id }
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}

export const commandService = {
    myCommands,
    passedCommands,
    removecommand,
};
