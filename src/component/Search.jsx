import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
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

const API_URL = "http://localhost:5005";

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
  setArea,
  filterArea,
  city,
  setCity,
  filterCity,
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
}) {
  const [searchForm, setSearchForm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const [searchResult, setSearchResult] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchForm(value);
    setDropdownVisible(true);

    if (check) {
      setSearchHouses(value);
      if (value === "") {
        setDropdownVisible(false);
        setResult([]); // Clear the results when input is empty
        setSearchHouses("");
        setSearchResult([]);
      }
    } else {
      setSearch(value);
    }
  };

  const handleItemClick = (address) => {
    setSearchForm(address);
    setDropdownVisible(false);
    if (check) {
      setSearchHouses(address);
    } else {
      setSearch(address);
    }
  };

  const searchFilter = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/houses/search/result?page=${currentPage}&limit=${limit}&search=${searchForm}`
      );
      setSearchResult(response.data.result);
    } catch (e) {
      console.log(e.message);
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
        setResult(resultsToDisplay);
      } else {
        handleSearch(search, resultsToDisplay);
      }
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    searchFilter();
  }, [searchForm]);

  const shouldShow = location.pathname !== "/";

  return (
    <form
      onSubmit={handleSubmit}
      className={!shouldShow ? "search-form-wrapper" : "small-search-form"}
    >
      <div className="search-input-wrapper">
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
            className={!shouldShow ? "submit-search" : "submit-magnifier"}
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
        {shouldShow && (
          <div className="filter-wrapper">
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
            />
            <Roomfilter
              bedRoom={bedRoom}
              setBedRoom={setBedRoom}
              bathRoom={bathRoom}
              setBathRoom={setBathRoom}
            />
            <AreaFilter
              area={area}
              filterArea={filterArea}
              forSale={forSale}
              forRent={forRent}
            />
            <CitiesFilter
              city={city}
              filterCity={filterCity}
              forSale={forSale}
              forRent={forRent}
            />
            <HouseType
              forSale={forSale}
              forRent={forRent}
              houseList={houseList}
              houseType={houseType}
              houseTypeFilter={houseTypeFilter}
            />
            <FeatureFilter
              features={features}
              featureHouseFilter={featureHouseFilter}
            />
            <SquareAreaFilter
              squareAreaMin={squareAreaMin}
              squareAreaMax={squareAreaMax}
              squareAreaRange={squareAreaRange}
            />
          </div>
        )}
      </div>
    </form>
  );
}

export default Search;
