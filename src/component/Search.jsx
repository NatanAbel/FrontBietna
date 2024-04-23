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

function Search({
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
  handleAvailabilityClick,
  houseType,
  houseTypeFilter,
  features,
  featureHouseFilter,
  calculateMinPrice,
}) {
  const [searchForm, setSearchForm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setSearchForm(e.target.value);
    setDropdownVisible(true);

    if (check) {
      setSearchHouses(e.target.value);
    } else {
      setSearch(e.target.value);
    }
  };
  // console.log("handleAvailabilityClick......");

  const handleItemClick = (address) => {
    setSearchForm(address);
    setDropdownVisible(false);
    if (check) {
      setSearchHouses(address);
    } else {
      setSearch(address);
    }
  };

  const searchFilter = search
    ? search &&
      houses.filter((house) => {
        return search === ""
          ? true
          : house.address.toLowerCase().includes(search.toLowerCase());
      })
    : searchHouses &&
      houseList.filter((house) => {
        return searchHouses === ""
          ? true
          : house.address.toLowerCase().includes(searchHouses.toLowerCase());
      });

  const resultsToDisplay = searchFilter.slice(0, 5);

  // filter results if they have duplicate addresses
  const resultToCheck = searchForm && resultsToDisplay.map((house) => house.address.toLowerCase())
  // console.log("resultToCheck..........19999999999",resultToCheck)
  const uniqueAddresses =
    searchForm &&
    resultToCheck.filter((address, index, array) => array.indexOf(address) === index);

  const handleSubmit = (e) => {
    e.preventDefault();

    const addressStartsWith =
      searchForm && uniqueAddresses.filter((adrs) => adrs.includes(searchForm));

    if (searchForm.length > 0 && addressStartsWith.length !== 0) {
      if (check) {
        setResult(resultsToDisplay);
        // handleSearch(searchHouses, resultsToDisplay);
      } else {
        handleSearch(search, resultsToDisplay);

        // console.log("search......88888",search)
        // navigate("/houses/allHouses", {
        //   state: { search, results: resultsToDisplay},
        // });
      }
      setDropdownVisible(false);
    }
  };
  // console.log("searchForm....");

  useEffect(() => {}, [houses, houseList]);

  // shouldShowDropdown is hiding the filter options on a landing page
  const shouldShow = location.pathname !== "/";
  // console.log("filteredHouse...5");

  return (
    <form
      onSubmit={handleSubmit}
      className={!shouldShow ? "search-form-wrapper" : "small-search-form"}
    >
      <div className="search-input-wrapper">
        <div className="search-input">
          <input
            value={search ? search : searchHouses}
            // value={search}
            type="search"
            placeholder="Seacrch-houses"
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
              {searchForm &&
                uniqueAddresses.map((address) => {
                  return (
                    <div key={address} className="search-list-wrapper">
                      <li
                        className="search-list"
                        onClick={() => handleItemClick(address)}
                      >
                        {address}
                      </li>
                    </div>
                  );
                })}
            </ul>
          )}
        </div>
        {shouldShow && (
          <div className="filter-wrapper">
            <FilterAvailability
            calculateMinPrice={calculateMinPrice}
              forRent={forRent}
              forSale={forSale}
              handleAvailabilityClick ={handleAvailabilityClick}
            />
            <PriceFilter
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              forRent = {forRent}
            />
            <Roomfilter 
              bedRoom = {bedRoom}
              setBedRoom = {setBedRoom}
              bathRoom = {bathRoom}
              setBathRoom ={setBathRoom}
              />

            <AreaFilter
              area = {area}
              filterArea = {filterArea}
              forSale={forSale}
              forRent = {forRent}
            />
            <CitiesFilter
              city = {city}
              filterCity = {filterCity}
              forSale={forSale}
              forRent = {forRent}
            />
            <HouseType 
              forSale={forSale}
              forRent = {forRent}
              houseList = {houseList}
              houseType = {houseType}
              houseTypeFilter={houseTypeFilter}
              />
            <FeatureFilter
              features = {features}
              featureHouseFilter = {featureHouseFilter}
              />
          </div>
        )}
      </div>
    </form>
  );
}

export default Search;
