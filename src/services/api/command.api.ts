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
async function signalerCommand(problem: string, command_id: number) {
    const formData = new FormData();
    formData.append("problem_from", 'CLIENT')
    formData.append("problem", problem)
    formData.append("command_id", command_id.toString())
    try {
        const response = await api.post(
            "signaler_command",
            formData
        );
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}
async function validatecommand(command_id: number) {

    try {
        const response = await api.post(
            "signaler_command",
            { command_id: command_id }
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
    signalerCommand,
    validatecommand,
};
