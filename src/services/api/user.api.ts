import { localStorageService } from '../localStorageService';
import { api } from './../axiosApi';
interface loginValues {
  email: string,
  password: string,
  remember?: boolean,
  fcm: string
}
interface registerValues {
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  passwordConfirm: string,
  phone: string,
}

async function loginUser(values: loginValues) {
  const data = values;
  try {
    const response = await api.post("loginClient", {
      email: data.email,
      password: data.password,
      fcm: "",
    });
    const { token, user } = response.data.data;
    return { token, user };
  } catch (error) {
    throw error;
  }
}

async function registerUser(values: registerValues) {
  try {
    const response = await api.post("signupclient", {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
      confirm_password: values.passwordConfirm,
      phone: values.phone,
    }, { authorization: false });
    const token = response.data.data.token;
    const user = response.data.data.client;
    return { token, user };
  } catch (error) {
    throw error;
  }
}
async function getUser(user_id: string) {
  try {
    if (user_id === undefined) {
      return { status: undefined, data: undefined };
    }
    const response = await api.get(
      `getClient/${user_id}`,
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}

async function updatePassword(userData: any) {
  try {
    const user_id = localStorageService.getUserId()
    if (user_id === undefined) {
      return { status: undefined, data: undefined };
    }
    const response = await api.put(
      `updateClienPW/${user_id}`,
      userData
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}
async function updateAccount(userData: any) {
  try {
    const user_id = localStorageService.getUserId()
    if (user_id === undefined) {
      return { status: undefined, data: undefined };
    }
    const response = await api.post(
      `updateClient/${user_id}`,
      userData
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}
async function addfavorite(supp_id: number) {
  try {
    const response = await api.post(
      `addfavorite`, { id_supplier: supp_id }
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}
async function deletefavorite(supp_id: number) {
  try {
    const response = await api.post(
      `deletefavorite`, { id_supplier: supp_id }
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}
async function getClientFavorits() {
  try {
    const response = await api.get(
      `getClientFavorits`
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}

async function gifts() {
  try {
    const response = await api.get(
      `gifts`
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}

async function deleteAccount() {
  try {
    const response = await api.delete(
      `deleteClient/${localStorage.getItem('userId')}`, {
    }

    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}

interface Rating {
  command_id: number,
  command_rating: number,
  delivery_rating: number
  delivery_comment: [
    {
      comment: string
    }
  ] | [],
  command_comment: [
    {
      comment: string
    }
  ] | [],
}
async function createDeliveryRating(rate: Rating) {
  try {
    const response = await api.post(
      `createDeliveryRating`, rate
    );
    const { status, data } = response;
    return { status, data };
  } catch (error) {
    throw error;
  }
}
async function getClientFeedback() {
  try {
    const user_id = localStorageService.getUserId()
    const formDate = {
      'client_id': 0,
      'keyword': "",
    }
    if (user_id === undefined) {
      return { status: undefined, data: undefined };


    } else {
      formDate.client_id = Number(user_id);
      const response = await api.post(

        `backoffice/client_all_feedback_commands`, formDate
      );
      const { status, data } = response;
      return { status, data };
    }
  } catch (error) {
    throw error;
  }
}

export const userService = {
  loginUser,
  registerUser,
  getUser,
  updatePassword,
  updateAccount,
  addfavorite,
  deletefavorite,
  getClientFavorits,
  gifts,
  deleteAccount,
  createDeliveryRating,
  getClientFeedback,
};
