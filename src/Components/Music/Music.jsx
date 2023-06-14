import React, { useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useSelector, useDispatch } from 'react-redux'
import { updateSongsList, updateSongIndex } from '../../State/SongSlice'

import Song from '../Music/Song'

import './Music.css'

const Music = () => {

  const { songs, currentSong, songIndex } = useSelector((state) => state.songs)

  const musicListRef = useRef(null);
  const scrollRef = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    console.log('music list:', songs);
  }, [songs]) // log items whenever it changes

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const itemsArray = Array.from(songs);
    const [reorderedItem] = itemsArray.splice(result.source.index, 1);
    itemsArray.splice(result.destination.index, 0, reorderedItem);

    dispatch(updateSongsList(itemsArray));

    if (itemsArray[songIndex].id !== currentSong.id) {
      const newSongIndex = itemsArray.findIndex((song) => song.id === currentSong.id);
      dispatch(updateSongIndex(newSongIndex));
    }
  }

  function handleOnBeforeCapture(before) {
    if (before.draggableId === "draggable-div-id") {
      before.preventDefault();
    }
  }

  const handleScroll = (e) => {

    const totalHeight = e.target.scrollHeight;
    const scrollPosition = e.target.scrollTop;
    let currentPos = scrollPosition / totalHeight * 175

    if (currentPos >= 100)
      currentPos = 100

    console.log(currentPos)

    scrollRef.current.style.height = `${currentPos}vh`;

  }

  return (
    <div className="music-container" ref={musicListRef}>

      <DragDropContext onDragEnd={handleOnDragEnd} onBeforeCapture={handleOnBeforeCapture}>
        <Droppable droppableId="items">
          {(provided) => (
            <ul className="music-list" {...provided.droppableProps} ref={provided.innerRef} onScroll={handleScroll}>
              {songs.map(({ id, title, artist, album, imgage_entity_tag, plays, date }, index) => (
                <Draggable key={id} draggableId={id.toString()} index={index} >
                  {(provided) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef
                      }
                      className={`music-item ${index === songIndex ? 'active' : ''}`}
                    >
                      <Song active={index === songIndex} picId={id} title={title} artist={artist} imgage_entity_tag={imgage_entity_tag} />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div id="scrollLine" className="scroll-line" ref={scrollRef}></div>

    </div>
  );
};

export default Music;
