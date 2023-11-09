import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { api } from "../../services/axiosApi";
import { localStorageService } from "../../services/localStorageService";
import { AppDispatch } from "../store";

export type VerifysmsState = {
  loading: boolean;
  error: any;
  code: string;
};

const initialState: VerifysmsState = {
  loading: false,
  error: null,
  code: "",
};

const verifysmsSlice = createSlice({
  name: "verifysms",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    verifysmsSuccess: (state, action: PayloadAction<string>) => {
      const code = action.payload;
      state.loading = false;
      state.error = null;
      state.code = code;
    },
    verifysmsError: (state, action: PayloadAction<any>) => {
      const error = action.payload;
      state.loading = false;
      state.error = error;
    },
  },
});

export const { startLoading, verifysmsSuccess, verifysmsError } =
  verifysmsSlice.actions;

const verifysmsReducer = verifysmsSlice.reducer;
export default verifysmsReducer;

export const verifysmsCodeSelector = (state: RootState) => state.verifysms.code;
export const verifysmsErrorsSelector = (state: RootState) =>
  state.verifysms.error;
export const verifysmsLoadingSelector = (state: RootState) =>
  state.verifysms.loading;

// Action

export const verifysmsAction = (code: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(startLoading());
    const idUser = localStorageService.getUserId()
    const response = await api.get("verify/" + idUser + "?code=" + code);
    console.log(response.data)
    const { success, data } = response.data;
    if (success) {
      dispatch(verifysmsSuccess(data.code));
      return response;
    } else {
      dispatch(verifysmsError(response.data));
    }
  } catch (error) {
    dispatch(verifysmsError(error));
  }
};
