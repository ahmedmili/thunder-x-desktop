import { PayloadAction } from "@reduxjs/toolkit";
import { localStorageService } from "../../services/localStorageService";
import { Position } from "../../services/types";

export interface LocationState {
  position: Position | null;
}

export const initialLocationState: LocationState = {
  position: null,
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
    default:
      return state;
  }
};
