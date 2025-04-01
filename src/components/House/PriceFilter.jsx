import React, { useEffect, useRef, useState } from "react";

function PriceFilter({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  forRent,
  isMobile,
}) {
  const [minLocalPrice, setMinLocalPrice] = useState(minPrice);
  const [maxLocalPrice, setMaxLocalPrice] = useState(maxPrice);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isResize, setIsResize] = useState(window.innerWidth <= 1083);
  const [displayMinPrice, setDisplayMinPrice] = useState(false);
  const [displayMaxPrice, setDisplayMaxPrice] = useState(false);
  const dropdownRef = useRef(null);

  const handleMinPriceChange = (e) => {
    e.preventDefault();
    const enteredValue = parseInt(e.target.value);
    setMinLocalPrice(enteredValue);
    setMinPrice(enteredValue);
    setDisplayMinPrice(enteredValue > 0);
  };
  
  const handleMaxPriceChange = (e) => {
    e.preventDefault();
    e.stopPropagation()
    //parseInt function is used to convert the entered value to an int number.
    const enteredValue = parseInt(e.target.value);

    setMaxLocalPrice(enteredValue);
    setMaxPrice(enteredValue);
    // setDisplayMaxPrice(enteredValue > 0);
    if (enteredValue > 0) {
      setDisplayMaxPrice(true);
    } else {
      setDisplayMaxPrice(false);
    }
  };

  const dropdownRentMinPrices = [0, 1500, 2000, 3000, 4000, 5000];
  const dropdownRentMaxPrices = [0, 6000, 7000, 8000, 9000, 10000];
  const dropdownBuyMinPrices = [0, 50000, 100000, 150000, 200000, 250000, 300000];
  const dropdownBuyMaxPrices = [0, 400000, 450000, 500000, 550000, 600000, 700000];

  const handlePriceChange = (value, isMin)=>{
    if(isMin === "minPrice"){
      setMinPrice(value);
      setMinLocalPrice(value)
      setDisplayMinPrice(value > 0)
    }else{
      setMaxPrice(value);
      setMaxLocalPrice(value)
      setDisplayMaxPrice(value > 0)
    }
  }

  const toggleDropdown = (e) => {
    e.preventDefault();
    // toggleDropdown(e)
    const width = window.innerWidth;
    // Toggle if width is <= 768px or >= 1813px
    if (isMobile || width >= 1083) {
      setShowDropdown(!showDropdown);
      }
  };

  useEffect(() => {
    const handleResize = () => {
      // Optionally hide dropdown on resize
      const width = window.innerWidth;
      if (width <= 1083) {
        setIsResize(true);
      }else{
        setShowDropdown(false);
        setIsResize(false);
      }
  };

  const handleClickOutside =()=>{
    if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  }

  if (showDropdown) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    document.removeEventListener("mousedown", handleClickOutside);
  }
  },[isMobile,isResize,showDropdown])

  
  useEffect(() => {
    // Update the local state only when the external state changes
    setMinLocalPrice(minPrice);
    setMaxLocalPrice(maxPrice);
    if (minPrice < 0) {
      // Handle negative numbers
      setMinLocalPrice(0);
      setMinPrice(0);
    } else if (maxPrice < 0) {
      setMaxLocalPrice(0);
      setMaxPrice(0);
    }

  }, [minPrice, maxPrice]);
  
  return (
    <div className="price-filter " ref={dropdownRef}>
      <p className="mobile-price-text">Price</p>
      <div className="price-box">
        {displayMinPrice &&
        displayMaxPrice &&
        minLocalPrice > 0 &&
        maxLocalPrice > 0 ? (
          <p className="price-indicator">
            {(minLocalPrice / 1000).toFixed(1) < 1 &&(maxLocalPrice / 1000).toFixed(1) < 1 ? <p>${minLocalPrice } - ${maxLocalPrice }</p> :  <p>${Math.floor(minLocalPrice / 1000)}K - ${Math.floor(maxLocalPrice / 1000)}K</p>}
          </p>
        ) : <p className="price-text">Price</p>}
      </div>
      <button className="toggle-dropdown-btn" onClick={toggleDropdown}>{showDropdown ? "🔼" : "🔽"}</button>
      {(showDropdown || isResize) && <div className="price-dropdown-menu">
        <p className="price-title">Price Range</p>
        <div className="price-min-dropdown">
          {forRent ? (
            <>
              <div className="price-range">
                <input
                  type="number"
                  className="price-input"
                  value={minLocalPrice}
                  onChange={handleMinPriceChange}
                />
                <div className="price-range-digits">
                  <div className="range-dropdown">
                    {dropdownRentMinPrices.map((value) => (
                      <p
                        className="range-list"
                        key={value}
                        onClick={() => handlePriceChange(value, "minPrice")}
                      >
                        ${value.toLocaleString()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{width:"15px", height:"1px", backgroundColor:"black"}}></div> 
              <div className="price-range">
                <input
                  type="number"
                  className="price-input"
                  value={maxLocalPrice}
                  onChange={handleMaxPriceChange}
                />
                <div className="price-range-digits">
                  <div className="range-dropdown">
                    {dropdownRentMaxPrices.map((value) => (
                      <p
                        className="range-list"
                        key={value}
                        onClick={() => handlePriceChange(value, "maxPrice")}
                      >
                        ${value.toLocaleString()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>{" "}
            </>
          ) : (
            <>
              <div className="price-range">
                <input
                  type="number"
                  className="price-input"
                  value={minLocalPrice}
                  onChange={handleMinPriceChange}
                />
                <div className="price-range-digits">
                  <div className="range-dropdown">
                    {dropdownBuyMinPrices.map((value) => (
                      <p
                        className="range-list"
                        key={value}
                        onClick={() => handlePriceChange(value, "minPrice")}
                      >
                        ${value.toLocaleString()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{width:"15px", height:"1px", backgroundColor:"black"}}>
              </div> 
              <div className="price-range">
                <input
                  type="number"
                  className="price-input"
                  value={maxLocalPrice}
                  onChange={handleMaxPriceChange}
                />
                <div className="price-range-digits">
                  <div className="range-dropdown">
                    {dropdownBuyMaxPrices.map((value) => (
                      <p
                        className="range-list"
                        key={value}
                        onClick={() => handlePriceChange(value, maxPrice)}
                      >
                        ${value.toLocaleString()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>}
    </div>
  );
}

export default PriceFilter;
