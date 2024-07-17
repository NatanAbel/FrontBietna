import React, { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { selecthouses } from "../../store/houses/selectors";


function CitiesFilter({ city, filterCity, forRent, forSale }) {
  const house = useSelector(selecthouses);
  const [isLoading, setIsLoading] = useState(true);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);

  const { uniqueCities } = house;

  const toggleCityDropdown = (e) => {
    e.preventDefault();
    setShowCityDropdown(!showCityDropdown);
  };

  const handleCitySelection = (selectedCity) => {
    const cityToFilter = selectedCity === "none" ? "none" : selectedCity;
    filterCity(cityToFilter);
    setShowCityDropdown(false);
  };

  useEffect(() => {
    setIsLoading(false);
    setAvailableCities(uniqueCities);
  }, [uniqueCities]);

  return (
    <div className="filter-area-container">
      <div className="filter-area">
        <p className="title-filter-area">
          {city === "" ? <span>City</span> : city}
        </p>
        <button className="filter-area-btn" onClick={toggleCityDropdown}>
          {showCityDropdown ? <p>🔼</p> : <p>🔽</p>}
        </button>
        <ul className="filter-area-dropdown-display">
          {showCityDropdown && (
            <li>
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
              
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CitiesFilter;
