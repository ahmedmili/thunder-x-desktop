import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import rootReducer from "./slices";
import loggerMiddleware from "redux-logger";

export const store = configureStore({
  // Combine reducers for auth API, user API, and user state
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
  // Enable Redux DevTools extension in development mode
  devTools: process.env.NODE_ENV === "development",
});

// Define types for the Redux store state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

// Define custom hooks for accessing the store's dispatch and state
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
