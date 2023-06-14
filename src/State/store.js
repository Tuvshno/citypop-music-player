import {configureStore} from '@reduxjs/toolkit'
import loginReducer from './LogInSlice'
import songReducer from './SongSlice'

export const store = configureStore({
  reducer: {
    login: loginReducer,
    songs: songReducer
  }
})