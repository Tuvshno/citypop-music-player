import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showLogIn: false,
  globalUsername: '',
  isLoggedIn: false
}

const logInSlice = createSlice({
  name: 'logIn',
  initialState,
  reducers: {
    toggleShowLogIn: (state) => {
      state.showLogIn = !state.showLogIn
    },
    toggleIsLoggedIn: (state) => {
      state.isLoggedIn = !state.isLoggedIn
    },
    setGlobalUsername: (state, { payload }) => {
      console.log(payload)
      state.globalUsername = payload
    }
  },
})

export const { toggleShowLogIn, toggleIsLoggedIn, setGlobalUsername} = logInSlice.actions;

export default logInSlice.reducer;