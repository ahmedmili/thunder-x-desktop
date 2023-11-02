import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../services/types";
import { localStorageService } from "../../services/localStorageService";
import { boolean } from "zod";
import { userService } from "../../services/api/user.api";

interface IUserState {
  user: IUser | null;
  isAuthenticated: boolean;
}
const initialState: IUserState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    logout: (state) => {
      localStorageService.unsetUserCredentials();
      const authProvider = userService.checkAuthProvider()
      authProvider && userService.firebaseSignOut()
      return initialState;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    registerUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    login: (state, action: PayloadAction<string>) => {
      localStorageService.setUserToken(action.payload);
      state.isAuthenticated = true;
    },
  },
});

export default userSlice.reducer;

export const { logout, setUser, registerUser, login } = userSlice.actions;
