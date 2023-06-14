import React, { useEffect, useState, useRef } from 'react';
import './AudioPlayer.css'
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi'
import { FiPlay } from 'react-icons/fi'
import { CiPause1 } from 'react-icons/ci'

import { useSelector, useDispatch } from 'react-redux'
import { clearSongs, playlistSongClick, updateSong, updateSongsList, nextSong, previousSong } from '../../State/SongSlice'

const AudioPlayer = () => {

    const { songs, playlistSong, currentSong, showSongs, songIndex, volume } = useSelector((state) => state.songs)

    const [isPlaying, setIsPlaying] = useState(false)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)

    const audioPlayer = useRef()
    const progressBar = useRef()
    const animationRef = useRef()

    const dispatch = useDispatch()

    useEffect(() => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
    }, [audioPlayer?.current?.readyState]);

    useEffect(() => {
        if (audioPlayer.current) {
            audioPlayer.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (songIndex < songs.length && songIndex >= 0) {
            const newSong = songs[songIndex]
            console.log(newSong)

            const title = newSong.title.replace(/ /g, "%20");
            const artist = newSong.artist.replace(/ /g, "%20");
            let newURL = artist + "%20-%20" + title + '%20(' + newSong.date + ').mp3'
            newURL = 'https://d3ljcvel4d9gwx.cloudfront.net/' + newURL

            // Check if new song is the same as the currently playing song
            if (audioPlayer.current.src !== newURL) {
                audioPlayer.current.src = newURL;
                audioPlayer.current.load();

                // This is the new part - starting the playback when a new song is loaded.
                audioPlayer.current.oncanplaythrough = () => {
                    setIsPlaying(true);
                    audioPlayer.current.play();
                    animationRef.current = requestAnimationFrame(whilePlaying);
                }
            }
        }
    }, [songIndex])


    // useEffect(() => {

    //     if (songIndex < songs.length && songIndex >= 0) {
    //         const newSong = songs[songIndex]
    //         console.log(newSong)

    //         const title = newSong.title.replace(/ /g, "%20");
    //         const artist = newSong.artist.replace(/ /g, "%20");
    //         let newURL = artist + "%20-%20" + title + '%20(' + newSong.date + ').mp3'
    //         newURL = 'https://d3ljcvel4d9gwx.cloudfront.net/' + newURL

    //         audioPlayer.current.src = newURL;
    //         audioPlayer.current.load();
    //         // This is the new part - starting the playback when a new song is loaded.
    //         audioPlayer.current.oncanplaythrough = () => {
    //             setIsPlaying(true);
    //             audioPlayer.current.play();
    //             animationRef.current = requestAnimationFrame(whilePlaying);
    //         }

    //     }
    // }, [songIndex])

    const calculateTime = (secs) => {
        const minutes = Math.floor(secs / 60);
        const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(secs % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnedMinutes}:${returnedSeconds}`;
    }

    const togglePlayPause = async () => {
        if (!isPlaying && audioPlayer.current.src === '') {
            var title = currentSong.title.replace(/ /g, "%20");
            var artist = currentSong.artist.replace(/ /g, "%20");
            let newURL = artist + "%20-%20" + title + '%20(' + currentSong.date + ').mp3'
            newURL = 'https://d3ljcvel4d9gwx.cloudfront.net/' + newURL

            audioPlayer.current.src = newURL;
            await audioPlayer.current.load();

            setIsPlaying(true);
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying)
        } else {
            const prevValue = isPlaying;
            setIsPlaying(!prevValue);
            if (!prevValue) {
                audioPlayer.current.play();
                animationRef.current = requestAnimationFrame(whilePlaying)
            } else {
                audioPlayer.current.pause();
                cancelAnimationFrame(animationRef.current);
            }
        }
    }

    const whilePlaying = () => {
        progressBar.current.value = audioPlayer.current.currentTime;
        changePlayerCurrentTime();
        animationRef.current = requestAnimationFrame(whilePlaying);
    }

    const changeRange = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changePlayerCurrentTime();
    }

    const changePlayerCurrentTime = () => {
        progressBar.current.style.setProperty('--seek-before-width', `${progressBar.current.value / duration * 100}%`)
        setCurrentTime(progressBar.current.value);
    }

    const handleBackward = () => {
        if (songIndex > 0) {
            const newSong = songs[songIndex - 1]
            dispatch(previousSong())
            dispatch(updateSong(newSong))

            var title = newSong.title.replace(/ /g, "%20");
            var artist = newSong.artist.replace(/ /g, "%20");
            let newURL = artist + "%20-%20" + title + '%20(' + newSong.date + ').mp3'
            newURL = 'https://d3ljcvel4d9gwx.cloudfront.net/' + newURL

            audioPlayer.current.src = newURL;
            audioPlayer.current.load();
            audioPlayer.current.play();
        }
        // progressBar.current.value = Number(progressBar.current.value) - 10
        // changeRange()
    }

    const handleForward = () => {

        const newSong = songs[songIndex + 1]
        dispatch(nextSong())
        dispatch(updateSong(newSong))

        var title = newSong.title.replace(/ /g, "%20");
        var artist = newSong.artist.replace(/ /g, "%20");
        let newURL = artist + "%20-%20" + title + '%20(' + newSong.date + ').mp3'
        newURL = 'https://d3ljcvel4d9gwx.cloudfront.net/' + newURL

        audioPlayer.current.src = newURL;
        audioPlayer.current.load();
        audioPlayer.current.play();

        // progressBar.current.value = Number(progressBar.current.value) + 10
        // changeRange()
    }

    return (
        <div className='AudioPlayer'>
            <audio ref={audioPlayer} type="audio/mpeg" preload="metadata"></audio>
            <button className='backward' onClick={handleBackward}><BiSkipPrevious /> </button>
            {/* <button className='playPause' onClick={togglePlayPause}>
                {isPlaying ? <CiPause1 className='pause' /> : <FiPlay className='play'/>}
            </button> */}
            {isPlaying && <button className='pause' onClick={togglePlayPause}>
                <CiPause1 />
            </button>}
            {!isPlaying && <button className='play' onClick={togglePlayPause}>
                <FiPlay />
            </button>}

            <button className='forward' onClick={handleForward}><BiSkipNext /> </button>

            <input className='progressBar'
                ref={progressBar}
                defaultValue='0'
                type="range"
                onChange={changeRange} />
        </div>
    );
}

export default AudioPlayer;