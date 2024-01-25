import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userService } from "../../services/api/user.api";
import { localStorageService } from "../../services/localStorageService";
import { IUser } from "../../services/types";

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
    setUserCredentials: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      localStorageService.setUserCredentials(action.payload.user, action.payload.token);
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
});

export default userSlice.reducer;

export const { logout, setUser, registerUser, login, setUserCredentials } = userSlice.actions;
