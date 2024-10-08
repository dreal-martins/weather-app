import { createSlice } from "@reduxjs/toolkit";
import { FavoriteCitiesState } from "types";

const initialState: FavoriteCitiesState = {
  favorites: JSON.parse(localStorage.getItem("favorites") || "[]"),
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action) => {
      state.favorites = action.payload;
    },
    loadFavoriteCities: (state) => {
      state.favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    },
  },
});

export const { toggleFavoriteCity, loadFavoriteCities } = favoriteSlice.actions;

export default favoriteSlice.reducer;
