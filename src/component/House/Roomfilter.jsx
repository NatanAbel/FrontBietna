import { faBathtub } from "@fortawesome/free-solid-svg-icons";
import { faBed } from "@fortawesome/free-solid-svg-icons/faBed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

function RoomFilter({ bedRoom, setBedRoom, bathRoom, setBathRoom, isMobile }) {
  const [localBedRoom, setLocalBedRoom] = useState(bedRoom);
  const [localBathRoom, setLocalBathRoom] = useState(bathRoom);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isResize, setIsResize] = useState(window.innerWidth < 1083);
  const [selectedRoom, setSelectedRoom] = useState("");
  const dropdownRef = useRef(null)
  // Handle bedroom selection
  const handleBedRoomSelect = (value) => {
    setLocalBedRoom(value);
    setBedRoom(value);
    if(value === 0){
      setSelectedRoom("");
    }else{
      setSelectedRoom("bedroom");
    }
  };

  // Handle bathroom selection
  const handleBathRoomSelect = (value) => {
    setLocalBathRoom(value);
    setBathRoom(value);

    if(value === 0){
      setSelectedRoom("");
    }else{
      setSelectedRoom("bathroom");
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    // toggleDropdown(e)
    const width = window.innerWidth;
    // Toggle if width is <= 768px or >= 1813px
    if (isMobile || width >= 1083) {
      setShowDropdown(!showDropdown);
      }
  };

  // Sync the state with props when they change
  useEffect(() => {
    setLocalBedRoom(bedRoom);
    setLocalBathRoom(bathRoom);

    // setShowDropdown(isMobile);
  }, [bathRoom, bedRoom, isMobile]);

  // Utility function to determine if a value is selected
  const isSelected = (currentValue, selectedValue) =>
    currentValue === selectedValue;

  useEffect(() => {
    const handleResize = () => {
      // Optionally hide dropdown on resize
      const width = window.innerWidth;
      if (width < 1083) {
        setIsResize(width < 1083);
      }else{
        setShowDropdown(false);
        setIsResize(false)
      }
  };

  const handleClickOutside =()=>{
    if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
      // setShowDropdown(false);
    }
  }

  if (showDropdown) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener("mousedown", handleClickOutside);
  }

  },[showDropdown,isResize])

  return (
    <div className="room-container" ref={dropdownRef}>
      {/* Bedroom Filter */}
      <div className="room-head-title">
        {selectedRoom === "" ? (
          <p>Rooms</p>
        ) : selectedRoom === "bedroom" || selectedRoom === "bathroom" ? (
          <p className="room-numbers">
            <span className="room-icon">
              {localBedRoom >= 0 ? `${localBedRoom}+` : ""}
              <FontAwesomeIcon icon={faBed} />,
            </span>
            <span className="room-icon">
              {localBathRoom >= 0 ? `${localBathRoom}+` : ""}
              <FontAwesomeIcon icon={faBathtub} />
            </span>
          </p>
        ) : (
          ""
        )}
      </div>
      <button className="toggle-dropdown-btn" onClick={toggleDropdown}>
        {showDropdown ? <p>🔼</p> : <p>🔽</p>}
      </button>
      {(showDropdown || isResize || isMobile) && (
        <div className="rooms-dropdown">
          <div className="filter-room-wrapper">
            <p className="room-title">
              Bedrooms <FontAwesomeIcon icon={faBed} />
            </p>
            <div className="filter-room">
              <p
                className={isSelected(0, localBedRoom) ? "active" : ""}
                onClick={() => handleBedRoomSelect(0)}
              >
                Any
              </p>
              {[1, 2, 3, 4, 5].map((value) => (
                <p
                  key={value}
                  className={isSelected(value, localBedRoom) ? "active" : ""}
                  onClick={() => handleBedRoomSelect(value)}
                >
                  {value}
                </p>
              ))}
              <p
                className={localBedRoom > 5 ? "active" : ""}
                onClick={() => handleBedRoomSelect(6)}
              >
                5+
              </p>
            </div>
          </div>
          {/* Bathroom Filter */}
          <div className="filter-room-wrapper">
            <p className="room-title">
              Bathrooms <FontAwesomeIcon icon={faBathtub} />
            </p>
            <div className="filter-room">
              <p
                className={isSelected(0, localBathRoom) ? "active" : ""}
                onClick={() => handleBathRoomSelect(0)}
              >
                Any
              </p>
              {[1, 2, 3, 4, 5].map((value) => (
                <p
                  key={value}
                  className={isSelected(value, localBathRoom) ? "active" : ""}
                  onClick={() => handleBathRoomSelect(value)}
                >
                  {value}
                </p>
              ))}
              <p
                className={localBathRoom > 5 ? "active" : ""}
                onClick={() => handleBathRoomSelect(6)}
              >
                5+
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomFilter;
