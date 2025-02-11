import React, { useEffect, useRef, useState } from "react";
import {useSelector } from "react-redux";
import { selecthouses } from "../../store/houses/selectors";


function CitiesFilter({ city, filterCity}) {
  const house = useSelector(selecthouses);
  const [isLoading, setIsLoading] = useState(true);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const { uniqueCities } = house;

  const toggleCityDropdown = (e) => {
    e.preventDefault();
    setShowCityDropdown(!showCityDropdown);
  };

  const handleCitySelection = (selectedCity) => {
    const cityToFilter = selectedCity === "none" ? "none" : selectedCity;
    filterCity(cityToFilter);
    setShowCityDropdown(false)
  };

  useEffect(() => {
    setIsLoading(false);
    setAvailableCities(uniqueCities);
    
    const handleClickOutside =()=>{
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCityDropdown(false);
        // setShowDropdown(false);
      }
    }

    if (showCityDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [uniqueCities,showCityDropdown]);

  return (
    <div className="filter-area-container test-one" ref={dropdownRef}>
      <div className="filter-area">
        <p className="title-filter-area">
          {city === "" ? <span>City</span> : city}
        </p>
        <button className="filter-area-btn" onClick={toggleCityDropdown}>
          {showCityDropdown ? <p>🔼</p> : <p>🔽</p>}
        </button>
        <div className="filter-area-dropdown-display">
          {showCityDropdown  && (
            <div>
              <p
                onClick={() => handleCitySelection("none")}
                className="dropdown-item"
              >
                All
              </p>
              
              {!isLoading ? availableCities.map((homeCity) => {
                return (
                  <p
                    key={homeCity}
                    onClick={() => handleCitySelection(homeCity)}
                    className="dropdown-item"
                    value={homeCity}
                  >
                    {homeCity}
                  </p>
                );
              }) : <p>Loading.....</p>}
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CitiesFilter;
