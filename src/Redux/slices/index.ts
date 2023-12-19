import { combineReducers as combine } from "@reduxjs/toolkit";
import cartSlice from "./cart/cartSlice";
import commandsSlice from "./commandsSlice";
import homeReducer from "./home";
import homeDataSlice from "./homeDataSlice";
import { locationReducer } from "./location";
import messangerReducer from "./messanger";
import restaurantSlice from "./restaurantSlice";
import userSlice from "./userSlice";
import usersReducer from "./users";
import verifysmsReducer from "./verifysms";

const rootReducer = combine({
  user: userSlice,
  users: usersReducer,
  messanger: messangerReducer,
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
