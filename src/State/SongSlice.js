import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  songs: [],
  currentSong: {},
  showSongs: false,
  songIndex: 0,
  volume: 1,
  playlistSong: false, 
  loginDone: false
}

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    clearSongs: (state) => {
      state.songs = []
    },
    updateSongsList: (state, { payload }) => {
      state.songs = payload
    },
    updateSong: (state, { payload }) => {
      state.currentSong = payload
    },
    toggleShowSongs: (state) => {
      state.showSongs = !state.showSongs
    },
    nextSong: (state) => {
      state.songIndex = state.songIndex + 1
    },
    previousSong: (state) => {
      state.songIndex = state.songIndex - 1
    },
    updateSongIndex: (state, { payload }) => {
      state.songIndex = payload
    },
    updateVolume: (state, { payload }) => {
      state.volume = payload
    },
    playlistSongClick: (state) => {
      state.playlistSong = !state.playlistSong
    },
    toggleLoginDone: (state) => {
      state.loginDone = !state.loginDone
    }
  },
})

export const { toggleLoginDone, playlistSongClick, clearSongs, updateSong, updateSongsList, toggleShowSongs, nextSong, previousSong, updateSongIndex, updateVolume } = songSlice.actions;

export default songSlice.reducer;