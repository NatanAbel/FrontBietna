import React, { useEffect, useRef, useState } from 'react'

function SquareAreaFilter({squareAreaMin, squareAreaMax, squareAreaRange, isMobile}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isResize, setIsResize] = useState(window.innerWidth < 1813);
  const [displayMin, setDisplayMin] = useState(false);
  const [displayMax, setDisplayMax] = useState(false);
  const dropdownRef = useRef(null)


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
    }else{
      squareAreaRange(value, "maxSqm");
      setDisplayMax(value > 0);
    }
  }

  const toggleDropdown = (e) => {
    e.preventDefault();
    // toggleDropdown(e)
    const width = window.innerWidth;
    // Toggle if width is <= 768px or >= 1813px
    if (isMobile || width >= 1813) {
      setShowDropdown(!showDropdown);
      }
  };


  useEffect(() => {
    // Handle negative numbers
    if (squareAreaMin < 0 || isNaN(squareAreaMin)) {
      squareAreaRange(0, "minSqm")
    } else if (squareAreaMax < 0 || isNaN(squareAreaMax)) {
      squareAreaRange(0, "maxSqm")
    }

 setShowDropdown(isMobile);

  }, [squareAreaMin, squareAreaMax, isMobile]);


  useEffect(() => {
    const handleResize = () => {
      // Optionally hide dropdown on resize
      const width = window.innerWidth;
      if (width < 1813) {
        setIsResize(width < 1813);
      }else{
        setShowDropdown(false);
        setIsResize(false)
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

  },[isResize,showDropdown])



  return (
    <div className="price-filter  sqm-wrapper" ref={dropdownRef}>
      <p className="mobile-price-text">Sqm</p>
      <div className="price-box">
        {displayMin &&
        displayMax &&
        squareAreaMin > 0 &&
        squareAreaMax > 0 ? (
          <p className="price-indicator">
             <span>{squareAreaMin } - {squareAreaMax }</span> 
          </p>
        ) : (
          <p className="price-text">Sqm</p>
        )}
      </div>
      <button className="toggle-dropdown-btn" onClick={toggleDropdown}>{showDropdown ? "🔼" : "🔽"}</button>
      {(showDropdown || isResize) && 
      <div className="price-dropdown-menu square-range-dropdwon">
        <p className="price-title">Area</p>
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
              <div style={{width:"15px", height:"1px", backgroundColor:"black"}}>
              </div> 
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
