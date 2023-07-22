import { Action, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Console } from "console";
import { stat } from "fs";
import { RootState } from ".";
import { api } from "../../services/axiosApi";
import { User } from "../../services/types";
import { FormValues } from "../../views/register/register.page";
import { AppDispatch, AppThunk } from "../store";

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

export const usersSelector = (state: RootState) => state.users;
export const usersErrors = (state: RootState) => state.users.error;
const usersReducer = usersSlice.reducer;
export default usersReducer;

// Action

export const fetchUsers = (): AppThunk => async (dispatch: AppDispatch) => {
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
        const { token } = data;
        dispatch(addUserSuccess(data.client));
      } else {
        dispatch(addUserError(response.data));
      }
    } catch (error) {
      dispatch(addUserError(error));
    }
  };
