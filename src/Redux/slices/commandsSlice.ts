import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  commands: [
    {
      id: null,
      supplier: {
        id: null,
        manager: '',
        name: '',
        categorys: [], // Update the type of categorys as needed
        phone: '',
        localisation: {
          lat: 0,
          long: 0,
        },
      },
      cycle: '',
      cycle_at: '',
      delivery: {
        id: null,
        name: '',
        phone: '',
        stack: '',
        distance: null, // Update the type of distance as needed
        // Add more attributes as needed
      },
      delivery_price: '',
      distance: '',
      is_delivery: null,
      is_ready: null,
      localisation: {
        lat: null,
        long: null,
      },
      made_at: '',
      mode_pay: null,
      pre_assinged_delivery: false,
      products: [], // Update the type of products as needed
      secondary_phone: '',
      service_price: null,
      take_away_date: null,
      tip: '',
      to_adresse: '',
      total_price: 0,
      type: '',
      // Add more attributes as needed
    },
  ],
  selectedCommand: {
    id: null,
    supplier: {
      id: null,
      manager: '',
      name: '',
      categorys: [], // Update the type of categorys as needed
      phone: '',
      localisation: {
        lat: 0,
        long: 0,
      },
    },
    cycle: '',
    cycle_at: '',
    delivery: {
      id: null,
      name: '',
      phone: '',
      stack: '',
      distance: null, // Update the type of distance as needed
      // Add more attributes as needed
    },
    delivery_price: '',
    distance: '',
    is_delivery: null,
    is_ready: null,
    localisation: {
      lat: null,
      long: null,
    },
    made_at: '',
    mode_pay: null,
    pre_assinged_delivery: false,
    products: [], // Update the type of products as needed
    secondary_phone: '',
    service_price: null,
    take_away_date: null,
    tip: '',
    to_adresse: '',
    total_price: 0,
    type: '',
    // Add more attributes as needed
  },

  selectedLocation: null,
};

const commandSlice = createSlice({
  name: 'commands',
  initialState,
  reducers: {
    setCommands: (state, action) => {
      state.commands = action.payload;
    },
    setSelectedCommand: (state, action) => {
      state.selectedCommand = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
  },
});

export const { setCommands, setSelectedCommand, setSelectedLocation } =
  commandSlice.actions;

export default commandSlice.reducer;
