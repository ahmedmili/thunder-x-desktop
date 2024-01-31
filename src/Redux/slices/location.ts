import { PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../services/axiosApi";
import { localStorageService } from "../../services/localStorageService";
import { Position } from "../../services/types";

export interface LocationState {
  position: Position | null;
  showMap: boolean;
  showRegionError: boolean;
}

export const initialLocationState: LocationState = {
  position: null,
  showMap: false,
  showRegionError: false,
};

const getHomeDate = async (formData: any) => {
  const response = await api.post("get_home_page_data", formData);
  if (response.data.data.region) {
    return true
  } else {
    return false
  }

}

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
    case "SHOW_REGION_ERROR":
      return {
        ...state,
        showRegionError: action.payload,
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
