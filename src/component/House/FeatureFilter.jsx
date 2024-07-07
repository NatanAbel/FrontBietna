import axios from 'axios';
import React, { useEffect, useState } from 'react'

const API_URL = "http://localhost:5005";

function FeatureFilter({features,
    featureHouseFilter}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [localFeature, setLocalFeature] = useState([]);

const hundelFeature = ( clickedFeature) => {
    featureHouseFilter(clickedFeature);   
  };

  const toggleFeatureDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  // Fetch enum values for home types from the backend
  const featureEnumValues = async () => {
    try {
      const res = await axios.get(`${API_URL}/houses/enumValues/features`);
      setLocalFeature(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    featureEnumValues()
  },[])

  return (
    <div className="filter-area-container">
              <div className='filter-area'>
                <p className='title-filter-area'><span>Feature</span></p>
                <button
                  className="filter-area-btn"
                  onClick={toggleFeatureDropdown}
                >
                  {showDropdown ? "🔼" : "🔽"}
                </button>
                <ul className="filter-area-dropdown-display">
                  {showDropdown &&
                    localFeature.map((feature) => {
                      return (
                        <li key={feature} style={{ textDecoration: "none" }}>
                          <label htmlFor={feature}>
                            <input
                              type="checkbox"
                              id={feature}
                              name={feature}
                              value={feature}
                              checked={features.includes(feature)}
                              onChange={() => hundelFeature( feature)}
                            />
                            {feature}
                          </label>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
  )
}

export default FeatureFilter;