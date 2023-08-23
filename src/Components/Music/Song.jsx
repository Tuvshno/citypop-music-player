import React from 'react';
import citypop from '../../Components/Vinal/citypop.png'
import './Song.css'

import { useSelector, useDispatch } from 'react-redux'
import { toggleLoginDone, playlistSongClick, updateSong, updateSongIndex } from '../../State/SongSlice'
import { toggleShowLogIn } from '../../State/LogInSlice'
function Song(props) {
  const { songs, loginDone } = useSelector((state) => state.songs)

  const dispatch = useDispatch()

  const active = props.active
  let url = import.meta.env.VITE_CLOUDFRONT_IMG + props.picId + '.png'

  const handleClick = () => {

    if (!loginDone) {
      console.log('insidelogindone')

      dispatch(toggleShowLogIn())
      dispatch(toggleLoginDone())
    }

    const newSongIndex = songs.findIndex((song) => song.id === props.picId);
    dispatch(updateSongIndex(newSongIndex));
    dispatch(updateSong(songs[newSongIndex]))
    dispatch(playlistSongClick())
    console.log(newSongIndex)
  }

  return (
    // <div className={`songCard ${active ? 'active' : ''}`} style={{backgroundImage: `url(${url})`}}>
    <div className={`songCard ${active ? 'active' : ''}`} onClick={handleClick} style={{ backgroundImage: `url(${citypop})` }}>

      <div>
        <h3>{props.title}</h3>
        <h4>{props.artist}</h4>
      </div>
    </div>
  )
}

export default Song
