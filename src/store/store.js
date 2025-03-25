"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";

const loadState = () => {
  if (typeof window === "undefined") return undefined; // Don't load state on the server
  try {
    const serializedState = localStorage.getItem("reduxHotelState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (error) {
    console.error("Failed to load state:", error);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      cart: state.cart,
    });
    localStorage.setItem("reduxHotelState", serializedState);
  } catch (error) {
    console.error("Failed to save state:", error);
  }
};

const preloadedState = typeof window !== "undefined" ? loadState() : undefined;

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState, 
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    saveState(store.getState());
  });
}

export { store };
