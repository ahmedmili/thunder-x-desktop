// Import necessary functions and types from Redux Toolkit and React Redux
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { Position } from '../services/types';
import thunk from 'redux-thunk';

// Import API services
import userReducer from './slices/user/userSlice';
import restaurantSlice from './slices/restaurantSlice';
import homeDataSlice from './slices/homeDataSlice';
import cartSlice from './slices/cart/cartSlice';
import commandsSlice from './slices/commandsSlice';
import { localStorageService } from '../services/localStorageService';

// Define initial state of the app
interface AppState {
  location: google.maps.LatLng | null;
}

export interface LocationState {
  position: Position | null;
}

export const initialLocationState: LocationState = {
  position: null,
};

export const locationReducer = (
  state = initialLocationState,
  action: { type: string; payload?: any }
): LocationState => {
  switch (action.type) {
    case 'SET_LOCATION':
      localStorageService.setCurrentLocation(action.payload);
      return {
        ...state,
        position: action.payload,
        //  label: action.payload.label,
      };
    default:
      return state;
  }
};

// Configure the Redux store
export const store = configureStore({
  // Combine reducers for auth API, user API, and user state
  reducer: {
    userState: userReducer,
    location: locationReducer,
    restaurant: restaurantSlice,
    homeData: homeDataSlice,
    cart: cartSlice,
    commands: commandsSlice,
  },
  // Enable Redux DevTools extension in development mode
  devTools: process.env.NODE_ENV === 'development',
});

// Define types for the Redux store state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Define custom hooks for accessing the store's dispatch and state
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
