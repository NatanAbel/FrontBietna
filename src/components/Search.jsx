import DOMPurify from "dompurify"; // Import DOMPurify
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import FilterAvailability from "./House/FilterAvailability";
import PriceFilter from "./House/PriceFilter";
import Roomfilter from "./House/Roomfilter";
import AreaFilter from "./House/AreaFilter";
import CitiesFilter from "./House/CitiesFilter";
import HouseType from "./House/HouseType";
import FeatureFilter from "./House/FeatureFilter";
import SquareAreaFilter from "./House/SquareAreaFilter";
import { useDispatch } from "react-redux";
import axios from "axios";
import FilterCountry from "./House/FilterCountry";
import "./SearchFilters.css";
import { debounce } from "../utils/debounce";

const API_URL = import.meta.env.VITE_BACK_URL;

function Search({
  currentPage,
  limit,
  searchInput,
  handleSearch,
  houseList,
  handleSearchResult,
  forRent,
  forSale,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  bedRoom,
  setBedRoom,
  bathRoom,
  setBathRoom,
  area,
  filterArea,
  city,
  filterCity,
  country,
  filterCountry,
  handleAvailabilityClick,
  houseType,
  houseTypeFilter,
  features,
  featureHouseFilter,
  calculateMinPrice,
  squareAreaMin,
  squareAreaMax,
  squareAreaRange,
  handlePageClick,
}) {
  const dispatch = useDispatch();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const [searchForm, setSearchForm] = useState("");
  const [mobielFilter, setMobielFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showFilters, setShowFilters] = useState(false);
  const [isResize, setIsResize] = useState(window.innerWidth >= 1813);
  const [selectedAddresses, setSelectedAddresses] = useState([]);
  const dropdownRef = useRef(null);
  const { pathname } = location;

  // Sanitize function
  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const handleChange = (e) => {
    // Sanitize user input
    const value = sanitizeInput(e.target.value.toLowerCase());
    setDropdownVisible(true);
    setSearchForm(value);
    handleSearch(value);
    if (value === "") {
      setDropdownVisible(false);
      handleSearch(value);
      setSelectedAddresses([]);
    } else {
      searchFilter(value);
    }
  };

  const handleItemClick = (address) => {
    // Sanitize selected address
    const sanitizedAddress = sanitizeInput(address);
    setDropdownVisible(false);
    setSearchForm(sanitizedAddress);
    handleSearch(sanitizedAddress);
  };

  // Create a separate function to process the results
  const processSearchResults = (results, searchForm) => {
    if (!results || !searchForm) return;
    // Get the first 5 results
    const resultsToDisplay = results.slice(0, 5);

    // Get addresses from results
    const resultToCheck = resultsToDisplay.map((house) =>
      house.address.toLowerCase()
    );

    // Get unique addresses
    const uniqueAddresses = resultToCheck.filter(
      (address, index, array) => array.indexOf(address) === index
    );

    setSelectedAddresses(uniqueAddresses);

    // Update state with processed results
    setDropdownVisible(true);
  };

  const searchFilter = useCallback(
    debounce(async (searchForm) => {
      try {
        let currentPage = 1;
        let limit = 9;

        const response = await axios.get(
          `${API_URL}/houses/search/result?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
            searchForm
          )}`
        );
        const responseResult = response.data.result;

        if (searchForm && responseResult !== undefined) {
          // Process the results after setting them
          processSearchResults(responseResult, searchForm);
        }
      } catch (e) {
        console.log(e);
      }
    }, 300),
    []
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchForm.length > 0) {
      handleSearchResult();
      handleSearch(searchForm);
      setDropdownVisible(false);
    }
  };

  const mobFilterIcon = () => {
    setMobielFilter(!mobielFilter);
  };

  const toggleOtherFiters = (e) => {
    e.preventDefault(e);
    const width = window.innerWidth;
    // Toggle if width is <= 768px or >= 1813px
    if (width >= 768 || width <= 1813) {
      setShowFilters(!showFilters);
    }
  };

  useEffect(() => {
    //Handlle mobile devices filters for dropdown menu's to display without dropdown buttons.
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      // handle filters if it's not mobile device
      setMobielFilter(false);
      const width = window.innerWidth;
      if (width >= 768 && width <= 1813) {
        setIsResize(false);
      } else {
        setIsResize(width >= 1813);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isResize]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const shouldShow = pathname !== "/";

  return (
    <form
      onSubmit={handleSubmit}
      className={!shouldShow ? "landing-search-form" : "search-form"}
    >
      <div className="search-input-wrapper">
        {
          <div className="search-input">
            <input
              value={searchInput}
              type="search"
              placeholder="Search-houses"
              onChange={handleChange}
              className="input-search"
            />
            <button
              type="submit"
              className={
                !shouldShow
                  ? "landing-submit-search"
                  : "houselist-submit-magnifier"
              }
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            {dropdownVisible && (
              <ul
                className={
                  !shouldShow ? "dropDown-search" : "dropDown-search-small"
                }
              >
                {selectedAddresses.length > 0 &&
                  selectedAddresses.map((address) => (
                    <div key={address} className="search-list-wrapper ">
                      <li
                        className="search-list"
                        onClick={() => handleItemClick(address)}
                      >
                        {address}
                      </li>
                    </div>
                  ))}
              </ul>
            )}
          </div>
        }
        <div>
          <button className="filter-icon" onClick={mobFilterIcon}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        {shouldShow && (
          <div
            className={!mobielFilter ? "filter-wrapper " : "mobile-filter show"}
          >
            <div className="search-input">
              <input
                value={searchInput}
                type="search"
                placeholder="Search-houses"
                onChange={handleChange}
                className="input-search"
              />
              <button
                type="submit"
                className={
                  !shouldShow
                    ? "landing-submit-search"
                    : "houselist-submit-magnifier"
                }
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
              {dropdownVisible && (
                <ul
                  className={
                    !shouldShow ? "dropDown-search" : "dropDown-search-small"
                  }
                >
                  {selectedAddresses.length > 0 &&
                    selectedAddresses.map((address) => (
                      <div key={address} className="search-list-wrapper">
                        <li
                          className="search-list"
                          onClick={() => handleItemClick(address)}
                        >
                          {address}
                        </li>
                      </div>
                    ))}
                </ul>
              )}
            </div>
            <FilterAvailability
              handlePageClick={handlePageClick}
              calculateMinPrice={calculateMinPrice}
              forRent={forRent}
              forSale={forSale}
              handleAvailabilityClick={handleAvailabilityClick}
            />
            <PriceFilter
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              forRent={forRent}
              isMobile={isMobile}
            />
            <Roomfilter
              bedRoom={bedRoom}
              setBedRoom={setBedRoom}
              bathRoom={bathRoom}
              setBathRoom={setBathRoom}
            />
            <FilterCountry country={country} filterCountry={filterCountry} />
            <div className="rest-filter-wrapper" ref={dropdownRef}>
              <button className="rest-btn" onClick={toggleOtherFiters}>
                More
              </button>

              {(showFilters || isMobile || isResize) && (
                <div className="rest-filters">
                  <PriceFilter
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                    forRent={forRent}
                  />
                  <Roomfilter
                    bedRoom={bedRoom}
                    setBedRoom={setBedRoom}
                    bathRoom={bathRoom}
                    setBathRoom={setBathRoom}
                    isMobile={isMobile}
                  />
                  <CitiesFilter
                    city={city}
                    filterCity={filterCity}
                    forSale={forSale}
                    forRent={forRent}
                  />
                  <AreaFilter
                    area={area}
                    filterArea={filterArea}
                    forSale={forSale}
                    forRent={forRent}
                  />
                  <HouseType
                    forSale={forSale}
                    forRent={forRent}
                    houseList={houseList}
                    houseType={houseType}
                    houseTypeFilter={houseTypeFilter}
                    isMobile={isMobile}
                  />
                  <FeatureFilter
                    features={features}
                    featureHouseFilter={featureHouseFilter}
                    isMobile={isMobile}
                  />
                  <SquareAreaFilter
                    squareAreaMin={squareAreaMin}
                    squareAreaMax={squareAreaMax}
                    squareAreaRange={squareAreaRange}
                    isMobile={isMobile}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

export default Search;
