import React, { useEffect, useState } from "react";

function PriceFilter({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  forRent,
}) {
  const [minLocalPrice, setMinLocalPrice] = useState(minPrice);
  const [maxLocalPrice, setMaxLocalPrice] = useState(maxPrice);
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayMinPrice, setDisplayMinPrice] = useState(false);
  const [displayMaxPrice, setDisplayMaxPrice] = useState(false);

  const handleMinPriceChange = (e) => {
    e.preventDefault();
    const enteredValue = parseInt(e.target.value);
    setMinLocalPrice(enteredValue);
    setMinPrice(enteredValue);
    setDisplayMinPrice(enteredValue > 0);
    // if (enteredValue > 0) {
    //   setDisplayMinPrice(true);
    // } else {
    //   setDisplayMinPrice(false);
    // }
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

  const dropdownRentMinPrices = [1500, 2000, 3000, 4000, 5000];
  const dropdownRentMaxPrices = [6000, 7000, 8000, 9000, 10000];
  const dropdownBuyMinPrices = [50000, 100000, 150000, 200000, 250000, 300000];
  const dropdownBuyMaxPrices = [400000, 450000, 500000, 550000, 600000, 700000];

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
    <div className="price-filter">
      {/* <button>Price</button> */}
      <div style={{ width: "80px", height: "30px" }}>
        {displayMinPrice &&
        displayMaxPrice &&
        minLocalPrice > 0 &&
        maxLocalPrice > 0 ? (
          <p>
            {(minLocalPrice / 1000).toFixed(1) < 1 &&(maxLocalPrice / 1000).toFixed(1) < 1 ? <span>${minLocalPrice } - ${maxLocalPrice }</span> : <span>${(minLocalPrice / 1000).toFixed(1)}K - ${(maxLocalPrice / 1000).toFixed(1)}K</span>}
          </p>
        ) : (
          <p>Price</p>
        )}
      </div>
      <div className="price-dropdown-menu">
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
                        ${value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div >-</div> 
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
                        ${value}
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
                        ${value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              {/* <div className="price-range">-</div> */}
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
                        ${value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PriceFilter;
