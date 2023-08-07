import { api } from './../axiosApi';
interface loginValues {
  email: string,
  password: string,
  remember? : boolean,
  fcm:string
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
  // console.log(values)
  const data = values;
  try {
    const response = await api.post("loginClient", {
      email: data.email,
      password: data.password,
      fcm:"",
    });
    const { token, user } = response.data.data;
    return { token, user };
  } catch (error) {
    console.error('Error', error);
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
    console.error('Error', error);
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
    console.error('Error', error);
    throw error;
}
}

export const userService = { loginUser, registerUser, getUser };
