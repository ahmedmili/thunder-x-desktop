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
async function isdelivery(supplier_id: number) {

    const formData = {
        supplier_id: supplier_id,
        service: 'take_away'
    }
    try {
        const response = await api.post("supplier/isdelivery", formData);
        const { status, data } = response;
        const take_away = data.data.ok
        return take_away;
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

async function getOnlinePayTax() {
    try {
        const response = await api.get("settings/tax_card");
        const { status, data } = response;
        return { status, data };
    } catch (error) {
        throw error;
    }
}

// getOnlinePayTax(){
//     return this.http.get(`${this.url}/settings/tax_card`, {observe: 'response'});
//   }
export const commandService = {
    myCommands,
    passedCommands,
    removecommand,
    signalerCommand,
    validatecommand,
    isdelivery,
    getOnlinePayTax,
};
