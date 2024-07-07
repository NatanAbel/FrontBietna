import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selecthouses } from "../../store/houses/selectors";
import { fetchedHouses } from "../../store/houses/thunks";
import { useLocation } from "react-router-dom";

function AreaFilter({ area, filterArea, forRent, forSale }) {
  const dispatch = useDispatch();
  const house = useSelector(selecthouses);
  const [isLoading, setIsLoading] = useState(true);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const location = useLocation().pathname;

  const { allHouses } = house;

  const toggleAreaDropdown = (e) => {
    e.preventDefault();
    setShowAreaDropdown(!showAreaDropdown);
  };

  const handleAreaSelection = (selectedArea) => {
    const areaToFilter = selectedArea === "none" ? "none" : selectedArea;
    filterArea(areaToFilter);
    setShowAreaDropdown(false);
  };

  useEffect(() => {
    //Compute available areas whenever allHouses, forRent, or forSale changes
    const selectedArea = new Set(); // Sets are JavaScript data structures that store unique values, meaning each value can only occur once within the set.
    allHouses.forEach((house) => {
      if (
        (forRent && house.availability.forRent) ||
        (forSale && house.availability.forSale) ||
        (!forRent && !forSale)
      ) {
        selectedArea.add(house.address);
      }
    });
    //Converting object selectedArea to an array
    setAvailableAreas(Array.from(selectedArea));
  }, [allHouses, forRent, forSale]);

  return (
    <div className="filter-area-container">
      <div className="filter-area">
        <p className="title-filter-area">
          {area === "" ? <span>Area</span> : area}
        </p>
        <button className="filter-area-btn" onClick={toggleAreaDropdown}>
          {showAreaDropdown ? <p>🔼</p> : <p>🔽</p>}
        </button>
        <ul className="filter-area-dropdown-display">
          {showAreaDropdown && (
            <li>
              <p
                onClick={() => handleAreaSelection("none")}
                className="dropdown-item"
              >
                All
              </p>
              {availableAreas.map((homeArea) => {
                return (
                  <p
                    key={homeArea}
                    onClick={() => handleAreaSelection(homeArea)}
                    className="dropdown-item"
                    value={homeArea}
                  >
                    {homeArea}
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

export default AreaFilter;
