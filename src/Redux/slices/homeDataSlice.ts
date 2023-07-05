import { createSlice } from '@reduxjs/toolkit';

const homeDataSlice = createSlice({
  name: 'homeData',
  initialState: {
    data: null,
    loading: true,
    error: null,
    isDelivery: true, // new state property
  },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsDelivery: (state, action) => {
      // new action
      state.isDelivery = action.payload;
    },
  },
});

export const { setData, setLoading, setError, setIsDelivery } =
  homeDataSlice.actions;
export const selectHomeData = (state: { homeData: { data: any } }) =>
  state.homeData.data;
export const selectIsDelivery = (state: {
  homeData: { isDelivery: boolean };
}) => state.homeData.isDelivery;
export default homeDataSlice.reducer;
