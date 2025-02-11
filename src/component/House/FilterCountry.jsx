import React, { useEffect, useRef, useState } from "react";

function FilterCountry({ country, filterCountry }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleCountryDropdown = (e) => {
    e.preventDefault();
    setShowCountryDropdown(!showCountryDropdown);
  };

  const handleClick = (country) => {
    filterCountry(country);
  };
  const countries = ["Eritrea", "Uganda", "Ethiopia"];

  useEffect(() => {
    setIsLoading(false);
    const handleClickOutside = () => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
        // setShowDropdown(false);
      }
    };
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLoading, showCountryDropdown]);

  return (
    <div className="filter-area-container" ref={dropdownRef}>
      <div className="filter-area">
        <p className="title-filter-area">
          {country === "" ? <span>Country</span> : country}
        </p>
        <button className="filter-area-btn" onClick={toggleCountryDropdown}>
          {showCountryDropdown ? <p>🔼</p> : <p>🔽</p>}
        </button>
        <div className="filter-area-dropdown-display">
          {showCountryDropdown && (
            <div>
              <p onClick={() => handleClick("none")} className="dropdown-item">
                All
              </p>

              {!isLoading ? (
                countries.map((homeCountry) => {
                  return (
                    <p
                      key={homeCountry}
                      onClick={() => handleClick(homeCountry)}
                      className="dropdown-item"
                      value={homeCountry}
                    >
                      {homeCountry}
                    </p>
                  );
                })
              ) : (
                <p>Loading.....</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilterCountry;
