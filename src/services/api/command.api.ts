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


// VerifyDistance(formData: any) {
//     return this.http.post(`${this.url}/verifydistance`,formData, { observe: 'response' });
//   }
 

//   MyOrders() {
//     return this.http.get(`${this.url}/mycommands`,{ observe: 'response' });
//   }
export const commandService = { myCommands };
