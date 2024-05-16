import React, { useEffect, useState } from 'react'

function SquareAreaFilter({squareAreaMin, squareAreaMax, squareAreaRange, forRent}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayMin, setDisplayMin] = useState(false);
  const [displayMax, setDisplayMax] = useState(false);

  const toggleDropdown = ()=>{
    setShowDropdown(!showDropdown)
  }

  const handleMinPriceChange = (e, value) => {
    e.preventDefault();
    const minValue = parseInt(e.target.value);
    squareAreaRange(minValue, value)
  
    setDisplayMin(minValue > 0);
  };

  const handleMaxPriceChange = (e, value) => {
    e.preventDefault();
    e.stopPropagation()
    //parseInt function is used to convert the entered value to an int number.
    const maxValue = parseInt(e.target.value);
    squareAreaRange(maxValue,value)
  };

  const dropdownMinSqm = [0,100, 150, 200, 250, 300];
  const dropdownMaxSqm = [400, 450, 500, 550, 600, 700];

  const handlePriceChange = (value, isMin)=>{
    if(isMin === "minSqm"){
      squareAreaRange(value, "minSqm");
      setDisplayMin(value > 0)
      console.log("valueMinType..........", typeof(value))
    }else{
      squareAreaRange(value, "maxSqm");
      setDisplayMax(value > 0);
      console.log("valueMaxType..........", typeof(value));
    }
  }

  useEffect(() => {
    // Handle negative numbers
    if (squareAreaMin < 0 || isNaN(squareAreaMin)) {
      squareAreaRange(0, "minSqm")
    } else if (squareAreaMax < 0 || isNaN(squareAreaMax)) {
      squareAreaRange(0, "maxSqm")
    }
  }, [squareAreaMin, squareAreaMax]);

  return (
    <div className="price-filter">
      {/* <button>Price</button> */}
      <div style={{ width: "80px", height: "30px" }}>
        {displayMin &&
        displayMax &&
        squareAreaMin > 0 &&
        squareAreaMax > 0 ? (
          <p>
             <span>{squareAreaMin } - {squareAreaMax }</span> 
          </p>
        ) : (
          <p>Sqm</p>
        )}
      </div>
      <button className="filter-area-btn" onClick={toggleDropdown}>{showDropdown ? "🔼" : "🔽"}</button>
      {showDropdown && 
      <div className="price-dropdown-menu square-range-dropdwon">
        <p className="price-title">Price Range</p>
        <div className="price-min-dropdown">
          
            <>
              <div className="price-range">
                <input
                  type="number"
                  className="price-input"
                  value={squareAreaMin}
                  onChange={(e) =>handleMinPriceChange( e,"minSqm")}
                />
                <div className="price-range-digits">
                  <div className="range-dropdown">
                    {dropdownMinSqm.map((sqm) => (
                      <p
                        className="range-list"
                        key={sqm}
                        onClick={() => handlePriceChange(sqm, "minSqm")}
                      >
                        ${sqm}
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
                  value={squareAreaMax}
                  onChange={(e) => handleMaxPriceChange(e, "maxSqm")}
                />
                <div className="price-range-digits">
                  <div className="range-dropdown">
                    {dropdownMaxSqm.map((value) => (
                      <p
                        className="range-list"
                        key={value}
                        onClick={() => handlePriceChange(value, "maxSqm")}
                      >
                        ${value}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </>
        </div>
      </div>}
    </div>
  );
}

export default SquareAreaFilter;
