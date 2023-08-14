import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '../../services/types';
import { ReactNode } from 'react';

interface RestaurantState {
  restaurants: Restaurant[];
  filterRestaurants: Restaurant[];
  searchQuery: string;
  priceFilter: number[];
  distanceFilter: number;
  ratingFilter: number;
  plateFilter: string[];
  list: string[];
}

const initialState: RestaurantState = {
  restaurants: [],
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
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;
