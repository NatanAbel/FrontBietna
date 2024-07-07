import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selecthouses } from "../../store/houses/selectors";
import { fetchedHouses } from "../../store/houses/thunks";
import { useLocation } from "react-router-dom";

function CitiesFilter({ city, filterCity, forRent, forSale }) {
  const dispatch = useDispatch();
  const house = useSelector(selecthouses);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [availableCities, setAvailableCities] = useState([]);
  const location = useLocation().pathname;

  const { allHouses } = house;

  const toggleCityDropdown = (e) => {
    e.preventDefault();
    setShowCityDropdown(!showCityDropdown);
  };

  const handleCitySelection = (selectedCity) => {
    const cityToFilter = selectedCity === "none" ? "none" : selectedCity;
    filterCity(cityToFilter);
    setShowCityDropdown(false);
  };

  // useEffect(() => {
  //   dispatch(fetchedHouses)
  //   }, [dispatch]);

  useEffect(() => {
    // Sets are JavaScript data structures that store unique values, meaning each value can only occur once within the set.
    const allCities = new Set();
    // Compute available areas whenever allHouses, forRent, or forSale changes
    allHouses.forEach((house) => {
      if (
        (forRent && house.availability.forRent) ||
        (forSale && house.availability.forSale) ||
        (!forRent && !forSale)
      ) {
        allCities.add(house.city);
      }
    });
    // setAvailableCities(Array.from(allCities));
    // set is converted back to an array using the spread operator [...allCities]
    setAvailableCities([...allCities]);
  }, [allHouses, forRent, forSale]);

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
              
              {availableCities.map((homeCity) => {
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
              })}
              
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CitiesFilter;
