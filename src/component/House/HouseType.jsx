import axios from 'axios';
import React, { useEffect, useState } from 'react'

const API_URL = "http://localhost:5005";

function HouseType({houseType,
    houseTypeFilter,}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [localHouseType, setLocalHouseType] = useState([]);
    // const [enumHouseType,setEnumHouseType] = useState([])

const hundelHouseType = (clickedHouse) => {
    // e.preventDefault();
    houseTypeFilter(clickedHouse);   
  };

  const toggleFeatureDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
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
    houseEnumValues()
  },[houseType])

  return (
    <div className="filter-area-container">
              <div className='filter-area'>
                <p className='title-filter-area'><span>Type</span></p>
                <button
                  className="filter-area-btn"
                  onClick={toggleFeatureDropdown}
                >
                  {showDropdown ? "🔼" : "🔽"}
                </button>
                <ul className="filter-area-dropdown-display">
                  {showDropdown &&
                    localHouseType.map((type) => {
                      return (
                        <li key={type} style={{ textDecoration: "none" }}>
                          <label htmlFor={type}>
                            <input
                              type="checkbox"
                              id={type}
                              name={type}
                              value={type}
                              checked={houseType.includes(type)}
                              onChange={() => hundelHouseType( type)}
                            />
                            {type}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
  )
}

export default HouseType