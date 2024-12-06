import { createSlice } from "@reduxjs/toolkit";

// Default (initial) state
const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  email: null, // Add email field here
};

// Slice action and reducer
export const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
      state.token = action.payload;
    },
    setEmailRegister: (state, action) => {
      state.email = action.payload; // Store the email in Redux
    },
  },
});

// Export the actions
export const { setToken, setUser, setEmailRegister } = authSlice.actions;

// Export the state/reducers
export default authSlice.reducer;
