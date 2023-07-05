import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../../services/types';

interface IUserState {
  user: IUser | null;
  isAuthenticated: boolean;
}
const initialState: IUserState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
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
      localStorage.setItem('token', action.payload);
      state.isAuthenticated = true;
    },
  },
});

export default userSlice.reducer;

export const { logout, setUser, registerUser, login } = userSlice.actions;
