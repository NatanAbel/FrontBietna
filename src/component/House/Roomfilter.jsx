import React, { useEffect, useState } from "react";

function Roomfilter({ bedRoom, setBedRoom, bathRoom, setBathRoom }) {
  const [localBedRoom, setLocalBedRoom] = useState(bedRoom);
  const [localBathRoom, setLocalBathRoom] = useState(bathRoom);

  const handleBedRoomChange = (e) => {
    e.preventDefault();
    const enteredValue = parseInt(e.target.value);
    setLocalBedRoom(enteredValue);
    setBedRoom(enteredValue);
  };
  const handleBathRoomChange = (e) => {
    e.preventDefault();
    const enteredValue = parseInt(e.target.value);
    setLocalBathRoom(enteredValue);
    setBathRoom(enteredValue);
  };
  
  useEffect(()=>{
    setLocalBedRoom(bedRoom);
    setLocalBathRoom(bathRoom);
  },[bathRoom, bedRoom])
  return (
    <div className="room-filter">
      <p>Beds & baths</p>
      <div className="bed-bath-filter">
        <div className="bed-room">
          <h2>Beds: {localBedRoom}</h2>
          <div className="">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={localBedRoom}
              onChange={handleBedRoomChange}
            />
          </div>
        </div>
        <div className="bath-room">
          <h2>Bath: {localBathRoom}</h2>
          <div className="">
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={localBathRoom}
              onChange={handleBathRoomChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roomfilter;
