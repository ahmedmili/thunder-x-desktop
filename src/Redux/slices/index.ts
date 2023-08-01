import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./cart/cartSlice";
import commandsSlice from "./commandsSlice";
import homeDataSlice from "./homeDataSlice";
import restaurantSlice from "./restaurantSlice";
import userSlice from "./userSlice";
import usersReducer from "./users";
import { locationReducer } from "./location";
import verifysmsReducer from "./verifysms";
import homeReducer from "./home";

const rootReducer = combineReducers({
  user: userSlice,
  users: usersReducer,
  verifysms: verifysmsReducer,
  location: locationReducer,
  restaurant: restaurantSlice,
  homeData: homeDataSlice,
  home: homeReducer,
  cart: cartSlice,
  commands: commandsSlice,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
