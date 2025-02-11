import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_BACK_URL;;

function HouseType({ houseType, houseTypeFilter, isMobile }) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isResize, setIsResize] = useState(window.innerWidth < 1813);
  const [localHouseType, setLocalHouseType] = useState([]);
  const dropdownRef = useRef(null);

  const hundelHouseType = (clickedHouse) => {
    // e.preventDefault();
    houseTypeFilter(clickedHouse);
  };

  const toggleTypeDropdown = (e) => {
    e.preventDefault();
    const width = window.innerWidth;
    // Toggle if width is <= 768px or >= 1813px
    if (width >= 1813) {
      setShowTypeDropdown(!showTypeDropdown);
    }
    // toggleDropdown();
  };

  // Fetch enum values for home types from the backend
  const houseEnumValues = async () => {
    try {
      const res = await axios.get(`${API_URL}/houses/homeTypes/enumValues`);
      setLocalHouseType(res.data);
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    houseEnumValues();

    const handleResize = () => {
      // Optionally hide dropdown on resize
      const width = window.innerWidth;
      if (width < 1813) {
        setIsResize(true);
      } else {
        setShowTypeDropdown(false);
        setIsResize(false);
      }
    };

    const handleClickOutside = () => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
        // setShowDropdown(false);
      }
    };

    if (showTypeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [houseType, isResize, isMobile, showTypeDropdown]);

  return (
    <div
      className="filter-area-container housetype-feature-wrapper"
      ref={dropdownRef}
    >
      <div className="filter-area">
        <p className="title-filter-area">
          <span>Type</span>
        </p>
        <button
          className="filter-area-btn type-dropdown-btn"
          onClick={toggleTypeDropdown}
        >
          {showTypeDropdown ? "🔼" : "🔽"}
        </button>
        <div className="filter-area-dropdown-display">
          {(showTypeDropdown || isResize) &&
            localHouseType.map((type) => {
              return (
                <div key={type} className="checkbox-content">
                  <input
                    type="checkbox"
                    id={type}
                    name={type}
                    value={type}
                    checked={houseType.includes(type)}
                    onChange={() => hundelHouseType(type)}
                  />

                  <label htmlFor={type} >{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default HouseType;
