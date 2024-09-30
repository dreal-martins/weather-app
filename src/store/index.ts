import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from "react-redux";
import appReducer from "./reducers/appReducer";
import weatherReducer from "./reducers/weatherReducer";
import favoritesReducer from "./reducers/favoriteReducer";

const store = configureStore({
  reducer: {
    app: appReducer,
    weather: weatherReducer,
    favorites: favoritesReducer,
  },
});

export type AppStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useReduxDispatch;
export const useAppSelector: TypedUseSelectorHook<AppStore> = useReduxSelector;

export default store;
