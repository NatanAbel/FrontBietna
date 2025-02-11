import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'

const API_URL = import.meta.env.VITE_BACK_URL;

function FeatureFilter({features,featureHouseFilter, isMobile}) {
    const [showFeatureDropdown, setShowFeatureDropdown] = useState(false);
    const [isResize, setIsResize] = useState(window.innerWidth < 1813);
    const [localFeature, setLocalFeature] = useState([]);
    const dropdownRef = useRef(null);


const hundelFeature = ( clickedFeature, e) => {
    e.preventDefault();
    featureHouseFilter(clickedFeature);   
  };

  const toggleFeatureDropdown = (e) => {
    e.preventDefault();
    // toggleDropdown(e)
    const width = window.innerWidth;
    // Toggle if width is <= 768px or >= 1813px
    if (width >= 1813) {
      setShowFeatureDropdown(!showFeatureDropdown);
      }
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
    const handleClickOutside =()=>{
      if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFeatureDropdown(false);
      }
    }

    const handleResize = () => {
      // Optionally hide dropdown on resize
      const width = window.innerWidth;
      if (width < 1813) {
        setIsResize(true);
      }else{
        setShowFeatureDropdown(false);
        setIsResize(false)
      }
  };

    if (showFeatureDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[features,showFeatureDropdown,isResize])

  return (
    <div className="filter-area-container housetype-feature-wrapper" ref={dropdownRef}>
              <div className='filter-area'>
                <p className='title-filter-area'><span>Feature</span></p>
                <button
                  className="filter-area-btn type-dropdown-btn"
                  onClick={toggleFeatureDropdown}
                >
                  {showFeatureDropdown ? "🔼" : "🔽"}
                </button>
                <div className="filter-area-dropdown-display">
                  {(showFeatureDropdown || isResize) &&
                    localFeature.map((feature) => {
                      return (
                        <div key={feature} className='checkbox-content'>
                            <input
                              type="checkbox"
                              id={feature}
                              name={feature}
                              value={feature}
                              checked={features.includes(feature)}
                              onChange={(e) => hundelFeature( feature, e)}
                            />
                            <label htmlFor={feature}>
                            {feature.charAt(0).toUpperCase() + feature.slice(1)}
                          </label>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
  )
}

export default FeatureFilter;