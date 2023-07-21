import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./cart/cartSlice";
import commandsSlice from "./commandsSlice";
import homeDataSlice from "./homeDataSlice";
import restaurantSlice from "./restaurantSlice";
import userSlice from "./userSlice";
import { localStorageService } from "../../services/localStorageService";
import { Position } from "../../services/types";

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
    case "SET_LOCATION":
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

const rootReducer = combineReducers({
  user: userSlice,
  location: locationReducer,
  restaurant: restaurantSlice,
  homeData: homeDataSlice,
  cart: cartSlice,
  commands: commandsSlice,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
