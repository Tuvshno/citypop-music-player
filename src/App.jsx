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
        // const response = await axios.get('https://api/getsongs');
        const response = [{ "id": 1, "title": "Driving My Love", "artist": "Anri", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 2, "title": "Good-Night for You", "artist": "Anri", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 3, "title": "I Can't Stop The Loneliness", "artist": "Anri", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 4, "title": "Remember Summer Days", "artist": "Anri", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 5, "title": "Shyness Boy", "artist": "Anri", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 6, "title": "Windy Summer", "artist": "Anri", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 7, "title": "You Are Not Alone", "artist": "Anri", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 8, "title": "Puzzle", "artist": "Hiroshi Abe", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 9, "title": "Bay City", "artist": "Junko Yagami", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 10, "title": "Yume No Tsuzuki", "artist": "Mariya Takeuchi", "album": null, "image_entity_tag": null, "plays": null, "date": "1987" }, { "id": 11, "title": "Fantasy", "artist": "Meiko Nakahara", "album": null, "image_entity_tag": null, "plays": null, "date": "1982" }, { "id": 12, "title": "Happy birthday, Love for you", "artist": "Meiko Nakahara", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 13, "title": "Dream In The Street", "artist": "Noriyo Ikeda", "album": null, "image_entity_tag": null, "plays": null, "date": "1980" }, { "id": 14, "title": "Sunset Road", "artist": "Reiko Takahashi", "album": null, "image_entity_tag": null, "plays": null, "date": "1980" }, { "id": 15, "title": "Magic Ways", "artist": "Tatsuro Yamashita", "album": null, "image_entity_tag": null, "plays": null, "date": "1984" }, { "id": 16, "title": "RIDE ON TIME", "artist": "Tatsuro Yamashita", "album": null, "image_entity_tag": null, "plays": null, "date": "1980" }, { "id": 17, "title": "SPARKLE", "artist": "Tatsuro Yamashita", "album": null, "image_entity_tag": null, "plays": null, "date": "1982" }, { "id": 18, "title": "I'm In Love", "artist": "Tomoko Aran", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 19, "title": "Midnight Pretenders", "artist": "Tomoko Aran", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 20, "title": "If you", "artist": "Toshiki Kadomatsu", "album": null, "image_entity_tag": null, "plays": null, "date": "1983" }, { "id": 21, "title": "Yoake ni Daite", "artist": "Yuko Imai", "album": null, "image_entity_tag": null, "plays": null, "date": "1987" }]

        // Shuffle the response data using the Fisher-Yates algorithm
        for (let i = response.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [response[i], response[j]] = [response[j], response[i]];
        }

        dispatch(updateSongsList(response)); // Use the dispatch defined at the top level
        dispatch(updateSong(response[0]));

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
