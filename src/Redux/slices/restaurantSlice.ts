import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, Restaurant } from '../../services/types';

interface RestaurantState {
  restaurants: Restaurant[];
  filterRestaurants: Restaurant[];
  searchQuery: string;
  priceFilter: number[];
  distanceFilter: number;
  ratingFilter: number;
  plateFilter: string[];
  list: string[];
  product: Product;
}

const initialState: RestaurantState = {
  restaurants: [],
  product: {
    id: 0,
    available: 0,
    description: "",
    discount_price: 0,
    discount_source: "",
    discount_type: "",
    discount_value: 0,
    image: [{
      id: 0,
      created_at: "",
      deleted_at: "",
      updated_at: "",
      name: "",
      path: "",
      user_id: 0
    }],
    is_popular: 0,
    name: "",
    options: [],
    options_max: [{
      id: 0,
      max: 0,
      type_option: "",
    }],
    position: 0,
    price: 0,
  },
  filterRestaurants: [],
  searchQuery: '',
  priceFilter: [],
  distanceFilter: 1000,
  ratingFilter: 0,
  plateFilter: [],
  list: [],
};

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setPriceFilter: (state, action: PayloadAction<number[]>) => {
      state.priceFilter = action.payload;
    },
    setDistanceFilter: (state, action: PayloadAction<number>) => {
      state.distanceFilter = action.payload;
    },
    setRatingFilter: (state, action: PayloadAction<number>) => {
      state.ratingFilter = action.payload;
    },
    setPlateFilter: (state, action: PayloadAction<string[]>) => {
      state.plateFilter = action.payload;
    },
    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setfilterRestaurants: (state, action) => {
      state.filterRestaurants = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  setPriceFilter,
  setDistanceFilter,
  setRatingFilter,
  setPlateFilter,
  setRestaurants,
  setfilterRestaurants,
  setProduct,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
