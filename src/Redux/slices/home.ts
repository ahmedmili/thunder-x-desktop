import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { userService } from "../../services/api/user.api";
import { api } from "../../services/axiosApi";
import { localStorageService } from "../../services/localStorageService";
import { Restaurant } from "../../services/types";
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
  theme: number;
  profilePage: number;
  data: HomeDataProps;
  loading: boolean;
  error: any;
  isDelivery: number;
};

const initialState: HomeDataState = {
  theme: 0,
  profilePage: 3,
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
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorageService.setUserTheme(action.payload)
    },
    setProfilePage: (state, action) => {
      state.profilePage = action.payload;
    },
  },
});

export const {
  getHomeDataSuccess,
  startLoading,
  getHomeDataError,
  setIsDelivery,
  setTheme,
  setProfilePage,
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
var favorsList: number[] = []
// Action
const getClientFavors = async () => {
  let isLoggedIn = localStorageService.getUserToken();
  if (!isLoggedIn) return
  const { status, data } = await userService.getClientFavorits()
  var favs: any = []
  data.success && data.data.map((i: Restaurant) => {
    favs.push(i.id)
  })
  favorsList = favs
}

export const fetchHomeData =
  (isDelivery: number, long: any, lat: any) =>
    async (dispatch: AppDispatch) => {
      getClientFavors()


      try {
        dispatch(startLoading());
        const response = await api.post("get_home_page_data", {
          delivery: isDelivery,
          lat: lat,
          long: long,
        });
        const { success, data } = response.data;
        var suppliersList: Restaurant[] = [];
        data.recommended.map((resto: any, index: number) => {
          let rest = resto;
          if (favorsList.includes(rest.id)) {
            rest.favor = true;
          } else {
            rest.favor = false;
          }
          suppliersList.push(rest);
        });
        data.recommended = suppliersList;
        if (success) {
          dispatch(getHomeDataSuccess(data));
        } else {
          dispatch(getHomeDataError(response));
        }
      } catch (error) {
        dispatch(getHomeDataError(error));
      }
    };
