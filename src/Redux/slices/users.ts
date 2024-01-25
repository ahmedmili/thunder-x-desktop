import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { api } from "../../services/axiosApi";
import { localStorageService } from "../../services/localStorageService";
import { User } from "../../services/types";
import { FormValues } from "../../utils/formUtils";
import { AppDispatch } from "../store";

export type UsersState = {
  loading: boolean;
  error: any;
  users: User[];
};

const initialState: UsersState = {
  loading: false,
  error: null,
  users: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    addUserSuccess: (state, action: PayloadAction<User>) => {
      const client = action.payload;
      state.loading = false;
      state.error = null;
      state.users = [{ ...state.users, ...client }];
    },
    addUserError: (state, action: PayloadAction<any>) => {
      const error = action.payload;
      state.loading = false;
      state.error = error;
    },
    getUsersSuccess: (state, action: PayloadAction<User[]>) => {
      const users = action.payload;
      state.loading = false;
      state.users = users;
    },
    getUsersError: (state, action: PayloadAction<any>) => {
      const error = action.payload;
      state.loading = false;
      state.error = error;
    },
  },
});
export const {
  startLoading,
  addUserSuccess,
  addUserError,
  getUsersSuccess,
  getUsersError,
} = usersSlice.actions;

const usersReducer = usersSlice.reducer;
export default usersReducer;

export const usersSelector = (state: RootState) => state.users;
export const usersErrors = (state: RootState) => state.users.error;
export const usersLoding = (state: RootState) => state.users.loading;

// Action

export const fetchUsers = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const response = await api.get("getlistclients");
    dispatch(getUsersSuccess(response.data));
  } catch (error) {
    dispatch(getUsersError(error));
  }
};

export const createUser =
  (user: FormValues) => async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const response = await api.post("signupclient", user);
      const { success, data } = response.data;
      if (success) {
        const { token, client } = data;
        dispatch(addUserSuccess(data.client));
        localStorageService.setUserCredentials(client, token);
        return response;
      } else {
        dispatch(addUserError(response.data));
      }
    } catch (error) {
      dispatch(addUserError(error));
    }
  };
