import { PayloadAction } from "@reduxjs/toolkit";
import { localStorageService } from "../../services/localStorageService";
import { Position } from "../../services/types";

export interface LocationState {
  position: Position | null;
  showMap: boolean;
}

export const initialLocationState: LocationState = {
  position: null,
  showMap :false,
};

export const locationReducer = (
  state = initialLocationState,
  action: PayloadAction<any>
): LocationState => {
  switch (action.type) {
    case "SET_LOCATION":
      localStorageService.setCurrentLocation(action.payload);
      return {
        ...state,
        position: action.payload,
      };
    case "SET_SHOW":
      return {
        ...state,
        showMap: action.payload,
      };
    default:
      return state;
  }
};
