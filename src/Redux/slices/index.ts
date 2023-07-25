import { combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./cart/cartSlice";
import commandsSlice from "./commandsSlice";
import homeDataSlice from "./homeDataSlice";
import restaurantSlice from "./restaurantSlice";
import userSlice from "./userSlice";
import usersReducer from "./users";
import { locationReducer } from "./location";

const rootReducer = combineReducers({
  user: userSlice,
  users: usersReducer,
  location: locationReducer,
  restaurant: restaurantSlice,
  homeData: homeDataSlice,
  cart: cartSlice,
  commands: commandsSlice,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
