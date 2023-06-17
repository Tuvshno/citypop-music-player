import { useState, useEffect, useRef } from 'react'
import axios from 'axios';

import './App.css'
import Vinal from './Components/Vinal/Vinal'
import LogIn from './Components/Login/LogIn'
import { useSelector, useDispatch } from 'react-redux'
import { clearSongs, updateSong, updateSongsList } from './State/SongSlice'

function App() {

  const { showLogIn, globalUsername, isLoggedIn } = useSelector((state) => state.login)
  const { songs, currentSong, showSongs } = useSelector((state) => state.songs)


  const dispatch = useDispatch();
  const vinalRef = useRef()

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        console.log('fetching')
        const response = await axios.get('http://3.145.204.124:5000/getsongs'); // replace with your api url

        // Shuffle the response data using the Fisher-Yates algorithm
        for (let i = response.data.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [response.data[i], response.data[j]] = [response.data[j], response.data[i]];
        }

        dispatch(updateSongsList(response.data)); // Use the dispatch defined at the top level
        dispatch(updateSong(response.data[0]))
        console.log(response.data)
      } catch (error) {
        console.error('Failed to fetch songs:', error);
      }
    };
    fetchSongs();
  }, [dispatch]);


  return (
    <>

      {showLogIn && <LogIn />}
      <Vinal />
      <h1 style={{
        position: 'fixed',
        right: 0,
        bottom: 0,
        margin: '10px', // Add some margin so it's not directly at the corner
      }}>
        {globalUsername}
      </h1>

    </>
  )
}

export default App
