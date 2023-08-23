import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { RiPlayListFill } from 'react-icons/ri'

import { clearSongs, updateSong, updateSongsList, toggleShowSongs, updateVolume } from '../../State/SongSlice'
import { useSelector, useDispatch } from 'react-redux'

import AudioPlayer from '../Audio/AudioPlayer'
import LogIn from '../Login/LogIn'
import Music from '../Music/Music'

import './Vinal.css'
import '../Login/LogIn.css'

function Vinal() {

  const dispatch = useDispatch()
  const { currentSong, showSongs } = useSelector((state) => state.songs)
  const musicVariants = {
    hidden: { x: "-100vw" },
    visible: {
      x: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    },
    exit: { x: "-100vw", transition: { ease: 'easeInOut' } }
  };

  // Define the motion variants for the list items
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1 }
    }),
  };

  const [MousePosition, setMousePosition] = useState({
    xAxis: 0,
    yAxis: 0
  })

  const containerRef = useRef()
  const vinalRef = useRef()
  const audioPlayerRef = useRef()

  const [nextImage, setNextImage] = useState('');
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = `${import.meta.env.VITE_CLOUDFRONT_IMG}${currentSong.id}.png`;
    console.log(getMostDominantColors(img.src))
    setLoadingImage(true);
    img.onload = () => {
      setLoadingImage(false);
      setNextImage(img.src);
    };
  }, [currentSong.id]);

  useEffect(() => {
    if (!loadingImage && nextImage) {
      vinalRef.current.style.backgroundImage = `url(${nextImage})`;
    }
  }, [loadingImage, nextImage]);

  const getMostDominantColors = async (imageUrl) => {
    const imgElement = document.createElement("img");
    imgElement.crossOrigin = 'Anonymous';  // Add this line
    imgElement.src = imageUrl;
    await imgElement.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    ctx.drawImage(imgElement, 0, 0, imgElement.width, imgElement.height);

    const imageData = ctx.getImageData(0, 0, imgElement.width, imgElement.height);
    const data = imageData.data;
    const colorCount = {};

    // Loop through the image pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert the RGB value to a single string and count it
      const color = `${r}-${g}-${b}`;
      colorCount[color] = (colorCount[color] || 0) + 1;
    }

    // Sort the colors by count and get the two most dominant colors
    const dominantColors = Object.entries(colorCount)
      .sort(([, aCount], [, bCount]) => bCount - aCount)
      .slice(0, 2)
      .map(([color]) => color.split("-").map(Number)); // Convert back to RGB array

    return dominantColors;
  };
  // useEffect(() => {
  //   vinalRef.current.style.backgroundImage = `url('https://d3ljcvel4d9gwx.cloudfront.net/${currentSong.id}.png')`;
  // }, [currentSong.id]);

  const handleMouseMove = (e) => {
    let xAxis = -(window.innerWidth / 2 - e.pageX) / 100;

    let yAxis = (window.innerHeight / 2 - e.pageY) / 100;
    setMousePosition({ xAxis, yAxis })

    vinalRef.current.style.transition = "none";

  }

  const handleMouseLeave = (e) => {
    vinalRef.current.style.transition = "all 0.5s ease";
    setMousePosition({
      xAxis: 0,
      yAxis: 0
    
    })

  }

  const handleMouseEnter = (e) => {
    // console.log(audioPlayerRef)
    // audioPlayerRef.current.style.transform = 'translateZ(150px)';
  }

  const changeVolume = (event) => {
    dispatch(updateVolume(event.target.value))
  }

  return (
    <>
      <div className="container" ref={containerRef}
        onMouseEnter={(e) => handleMouseEnter(e)}
        onMouseLeave={(e) => handleMouseLeave(e)}
        onMouseMove={(e) => handleMouseMove(e)}>

        <motion.div className="vinal"
          ref={vinalRef}
          style={{
            transform: `rotateY(${MousePosition.xAxis}deg) rotateX(${MousePosition.yAxis}deg)`,
          }}
          animate={{ left: showSongs ? '40%' : '30%' }} // Add this line
          transition={{ duration: 0.5, ease: "circOut" }} // And this line
        >

          {/* Playlist button */}
          <div className='button-container' onClick={() => dispatch(toggleShowSongs())}>
            <motion.div className='currentPlaylistButton'
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
            ><RiPlayListFill className='playlist-icon' />
            </motion.div>

          </div>

          {/* Volume Slider */}
          <div className="volume-control">
            <input
              type="range"
              id="volume"
              name="volume"
              min="0"
              max="1"
              step="0.01"
              onChange={changeVolume}
              defaultValue="1"
              orient="horizontal"
            />
          </div>

          {/* Title,Song */}
          <div className='vinal-information-card'>
            <h1 className='title'>{currentSong.title}</h1>
            <h2 className='artist'>{currentSong.artist}</h2>
          </div>

          {/* AudioPlayer */}
          <div className='audioPlayerContainer' ref={audioPlayerRef}>
            <AudioPlayer />
          </div>
        </motion.div>


        <AnimatePresence>
          {showSongs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}  // <-- here is the exit prop
              transition={{
                opacity: { duration: 0.25, ease: "circOut" }
              }}
            >
              <Music />
            </motion.div>
          )}
        </AnimatePresence>

      </div >
      {/* <Music /> */}

    </>
  )

}

export default Vinal