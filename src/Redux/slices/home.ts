import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { api } from "../../services/axiosApi";
import { AppDispatch } from "../store";

type HomeDataProps = {
  ads: any;
  categories: any[];
  favorites: any[];
  popular: any[];
  recommended: any[];
  region: object;
  today_offers: any[];
};
export type HomeDataState = {
  data: HomeDataProps;
  loading: boolean;
  error: any;
  isDelivery: number;
};

const initialState: HomeDataState = {
  data: {
    ads: {},
    categories: [],
    favorites: [],
    popular: [],
    recommended: [],
    region: {},
    today_offers: [],
  },
  loading: false,
  error: false,
  isDelivery: 1,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    getHomeDataSuccess: (state, action: PayloadAction<HomeDataProps>) => {
      const homeData = action.payload;
      state.loading = false;
      state.isDelivery = 1;
      state.data = {
        ads: homeData.ads,
        categories: homeData.categories,
        favorites: homeData.favorites,
        popular: homeData.popular,
        recommended: homeData.recommended,
        region: homeData.region,
        today_offers: homeData.today_offers,
      };
    },

    getHomeDataError: (state, action) => {
      const error = action.payload;
      state.loading = false;
      state.error = error;
    },
    setIsDelivery: (state, action) => {
      state.isDelivery = action.payload;
    },
  },
});

export const {
  getHomeDataSuccess,
  startLoading,
  getHomeDataError,
  setIsDelivery,
} = homeSlice.actions;

const homeReducer = homeSlice.reducer;
export default homeReducer;

export const adsHomeSelector = (state: RootState) => state.home.data.ads;
export const categoriesHomeSelector = (state: RootState) =>
  state.home.data.categories;
export const favoritesHomeSelector = (state: RootState) =>
  state.home.data.favorites;
export const popularHomeSelector = (state: RootState) =>
  state.home.data.popular;
export const recommendedHomeSelector = (state: RootState) =>
  state.home.data.recommended;
export const regionHomeSelector = (state: RootState) => state.home.data.region;
export const todayOffersSelector = (state: RootState) =>
  state.home.data.today_offers;
export const isDeliveryHomeSelector = (state: RootState) =>
  state.home.isDelivery;
export const homeErrorsSelector = (state: RootState) => state.home.error;
export const homeLoadingSelector = (state: RootState) => state.home.loading;

// Action

export const fetchHomeData =
  (isDelivery: number, long: any, lat: any) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const response = await api.post("get_home_page_data", {
        delivery: isDelivery,
        lat: lat,
        long: long,
      });
      const { success, data } = response.data;
      if (success) {
        dispatch(getHomeDataSuccess(data));
      } else {
        dispatch(getHomeDataError(response));
      }
    } catch (error) {
      dispatch(getHomeDataError(error));
    }
  };
