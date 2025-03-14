import DOMPurify from "dompurify"; // Import DOMPurify
import { faFilter, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FilterAvailability from "./House/FilterAvailability";
import PriceFilter from "./House/PriceFilter";
import Roomfilter from "./House/Roomfilter";
import AreaFilter from "./House/AreaFilter";
import CitiesFilter from "./House/CitiesFilter";
import HouseType from "./House/HouseType";
import FeatureFilter from "./House/FeatureFilter";
import SquareAreaFilter from "./House/SquareAreaFilter";
import { useDispatch, useSelector } from "react-redux";
import { searchFiltersFetched } from "../store/houses/thunks";
import { selecthouses } from "../store/houses/selectors";
import axios from "axios";
import FilterCountry from "./House/FilterCountry";
import "./SearchFilters.css";

const API_URL = import.meta.env.VITE_BACK_URL;

function Search({
  currentPage,
  limit,
  search = "",
  setSearch,
  searchHouses = "",
  setSearchHouses,
  searchFilterHouse,
  houses,
  check = false,
  houseList,
  setResult,
  onSubmit,
  handleSearch,
  result,
  forRent,
  setForRent,
  forSale,
  setForSale,
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
  handleSearchClick,
  handlePageClick,
  setSearchDisplay,
}) {
  const [searchForm, setSearchForm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const [searchResult, setSearchResult] = useState([]);
  const [mobielFilter, setMobielFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showFilters, setShowFilters] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isResize, setIsResize] = useState(window.innerWidth >= 1813);
  const dropdownRef = useRef(null);
  const { pathname } = location;

  // Sanitize function
  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const handleChange = (e) => {
    // Sanitize user input
    const value = sanitizeInput(e.target.value.toLowerCase());
    setSearchForm(value);
    setDropdownVisible(true);

    if (check) {
      setSearchHouses(value);
      if (value === "") {
        setDropdownVisible(false);
        setResult([]); // Clear the results when input is empty
        setSearchHouses("");
        setSearchResult([]);
        setSearchDisplay(false);
      }
    } else {
      setSearch(value);
    }
  };

  const handleItemClick = (address) => {
    // Sanitize selected address
    const sanitizedAddress = sanitizeInput(address);
    setSearchForm(sanitizedAddress);
    setDropdownVisible(false);
    if (check) {
      setSearchHouses(sanitizedAddress);
    } else {
      setSearch(sanitizedAddress);
    }
  };

  const searchFilter = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/houses/search/result?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(
          searchForm
        )}`
      );
      const responseResult = response.data.result;
      if (searchForm && responseResult !== undefined) {
        setSearchResult(responseResult);
      } else {
        if (check) {
          setResult([]);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const resultsToDisplay = searchResult.slice(0, 5);

  const resultToCheck =
    searchForm && resultsToDisplay.map((house) => house.address.toLowerCase());

  const uniqueAddresses =
    searchForm &&
    resultToCheck.filter(
      (address, index, array) => array.indexOf(address) === index
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const addressStartsWith =
      searchForm && uniqueAddresses.filter((adrs) => adrs.includes(searchForm));

    if (searchForm.length > 0 && addressStartsWith.length !== 0) {
      if (check) {
        setSearchDisplay(true);
        setResult(resultsToDisplay);
      } else {
        handleSearch(search, resultsToDisplay);
      }
      setDropdownVisible(false);
    } else {
      if (check) {
        setSearchDisplay(false);
        setResult([]);
      } else {
        handleSearch(search, searchResult);
      }
    }
  };

  useEffect(() => {
    if (searchForm) {
      searchFilter();
    }
  }, [searchForm]);

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
        // setShowDropdown(false);
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
        // setShowDropdown(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const mobFilterIcon = () => {
    setMobielFilter(!mobielFilter);
  };

  // const toggleOtherFiters = () => {
  //   setShowFilters(!showFilters)
  // }

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
              value={search ? search : searchHouses}
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
                {uniqueAddresses &&
                  uniqueAddresses.map((address) => (
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
                value={search ? search : searchHouses}
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
                  {uniqueAddresses &&
                    uniqueAddresses.map((address) => (
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
