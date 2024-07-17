import React, { useEffect, useState } from "react";
import {useSelector } from "react-redux";
import { selecthouses } from "../../store/houses/selectors";

function AreaFilter({ area, filterArea}) {
  const house = useSelector(selecthouses);
  const [isLoading, setIsLoading] = useState(true);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);

  const { uniqueAreas } = house;

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
    setIsLoading(false);
    setAvailableAreas(uniqueAreas);
  }, [uniqueAreas]);

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
              {!isLoading ? availableAreas.map((homeArea) => {
                return (
                  <p
                    key={homeArea}
                    onClick={() => {
                      handleAreaSelection(homeArea);
                    }}
                    className="dropdown-item"
                    value={homeArea}
                  >
                    {homeArea}
                  </p>
                );
              }) : <p>Loading.......</p>}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default AreaFilter;
