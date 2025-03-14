import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selecthouses } from "../store/houses/selectors";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { fetchedHouses, searchFiltersFetched } from "../store/houses/thunks";

// import { toggleFavorites } from "../store/houses/slice";
import Search from "../components/Search.jsx";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {
  selectFavs,
  selectIsAuthenticated,
  selectLoginToken,
  selectUser,
} from "../store/auth/selectors";
import { toggleFavorites, updateUser } from "../store/auth/slice";
import { Circles } from "react-loader-spinner";
import "./HouseList.css";
import HouseCards from "../components/House/HouseCards.jsx";
import { debounce } from "../utils/debounce.js";

const API_URL = import.meta.env.VITE_BACK_URL;

const compare_name = (player_a, player_b) => {
  return player_a.address.localeCompare(player_b.address);
};

// Create memoized components to prevent unnecessary re-renders
const MemoizedSearch = React.memo(Search);
const MemoizedHouseCards = React.memo(HouseCards);

function HouseList({ forRent, forSale, handleAvailabilityClick }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // const [isLike, setIsLike] = useState(false);
  const house = useSelector(selecthouses);
  const user = useSelector(selectUser);
  const token = useSelector(selectLoginToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [beds, setBeds] = useState(0);
  const [bath, setBath] = useState(0);
  const [maxHousePrice, setMaxHousePrice] = useState(false);
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [houseType, setHouseType] = useState([]);
  const [noResults, setNoResults] = useState("");
  const [features, setFeatures] = useState([]);
  const [squareAreaMin, setSquareAreaMin] = useState(0);
  const [squareAreaMax, setSquareAreaMax] = useState(0);
  const [limit, setLimit] = useState(9);
  // const currentPage = useRef(1);
  const [searchDisplay, setSearchDisplay] = useState(false);
  const [houses, setHouses] = useState([]);
  const [country, setCountry] = useState("");
  // Add a mount ref to prevent double fetching
  const isMounted = useRef(false);
  const currentPage = useRef(1);

  const { allHouses, pageCount, message } = house;

  // Skip variable with 0 value uses as the first argument of silce method to display houses
  const skip = 0;

  const { state, pathname } = location;
  // sorting houses based in the compare_name function above the component function
  const sortedHouses = [...houses].sort(compare_name);

  const filterArea = useCallback((chosenArea) => {
    if (chosenArea === "none") {
      setArea("");
      setCity("");
    } else {
      setArea(chosenArea);
    }
  }, []);

  const filterCity = useCallback((chosenCity) => {
    if (chosenCity === "none") {
      setCity("");
    } else {
      setCity(chosenCity);
    }
  }, []);

  const filterCountry = useCallback((chosenCountry) => {
    if (chosenCountry === "none") {
      setCountry("");
    } else {
      setCountry(chosenCountry);
    }
  }, []);

  const houseTypeFilter = useCallback((selectedType) => {
    setHouseType(prevHouseType => {
       // Check if the clicked feature is already in the enumHouseType array
      const isHouseTypeSelected = prevHouseType.includes(selectedType);
      if (!isHouseTypeSelected) {
         // If the feature is not selected, add it to the enumHouseType array
        return [...prevHouseType, selectedType];
      } else {
        // If the feature is already selected, remove it from the enumHouseType array
        return prevHouseType.filter((type) => type !== selectedType);
      }
    });
  }, []);


  const featureHouseFilter = useCallback((selectedFeature) => {
    setFeatures(prevFeatures => {
      // Check if the clicked feature is already in the enumHouseType array
      const isFeatureSelected = prevFeatures.includes(selectedFeature);
      if (!isFeatureSelected) {
          // If the feature is not selected, add it to the enumHouseType array
        return [...prevFeatures, selectedFeature];
      } else {
        // If the feature is already selected, remove it from the enumHouseType array
        return prevFeatures.filter((feature) => feature !== selectedFeature);
      }
    });
  }, []);

  // handeling square area range of the houses
  const squareAreaRange = useCallback((value, isMin) => {
    if (isMin === "minSqm") {
      setSquareAreaMin(value);
    } else if (isMin === "maxSqm") {
      setSquareAreaMax(value);
    }
  }, []);

  // function that checks if the house price range is above the highest price
  const checkHighestPrice = useCallback(() => {
    // storring all house prices in a variable
    let allHousesPrice = [];

     // filtering based on the status of houses and store its price to allHousesPrice array
    sortedHouses.filter((house) => {
      if (forRent && house.availability.forRent) {
        return allHousesPrice.push(house.rentalPrice);
      } else if (forSale && house.availability.forSale) {
        return allHousesPrice.push(house.price);
      }
    });

    // A condition that checks if allHousesPrice array is not empty and avoids Math.max() from having infinity result
    if (allHousesPrice.length > 0) {
      const highestPrice = Math.max(...allHousesPrice);
      // Check if the condition for setting maxHousePrice is met
      if (minPrice > highestPrice) {
        setMaxHousePrice(true);
      } else {
        setMaxHousePrice(false);
      }
    } else {
      // Handle the case when allHousesPrice is empty
      setMaxHousePrice(false);
    }
  }, [forRent, forSale, minPrice, sortedHouses]);

  // setting the minimum price of forSale and forRent based on the user clicks on the price dropdown
  const calculateMinPrice = useCallback((availability) => {
    const availableHouses = sortedHouses.filter((house) => {
      if (availability === "forRent") {
        return house.availability.forRent;
      } else if (availability === "forSale") {
        return house.availability.forSale;
      } else if (availability === "allHouses") {
        return house;
      }
      return false;
    });

    if (availableHouses.length > 0) {
      setMinPrice(0);
      setMaxPrice(0);
      setBath(1);
      setBeds(1);
      setArea("");
      setCity("");
      setHouseType([]);
      setFeatures([]);
      setSquareAreaMin(0);
      setSquareAreaMax(0);
    }
  }, [sortedHouses]);

  // Memoized clicked favourites button
  const handleFavourites = useCallback(async (houseId) => {
    // Perform basic validation on the client
    if (!houseId || !houseId.match(/^[a-fA-F0-9]{24}$/)) {
      console.error("Invalid houseId format");
      return;
    }

    const body = { favorites: houseId };

    try {
      const res = await axios.put(`${API_URL}/auth/update/profile`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        dispatch(toggleFavorites(houseId));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }, [dispatch, token]);

  // Memoize the filteredHouse variable using useMemo hook use to memoize the filtered house data based on the dependencies that cause the filtering to change.
  const filteredHouse = useMemo(() => {
    return houses.filter((house) => {
      if (pathname === "/houses/allHouses" || (!forRent && !forSale)) {
        return true; // Show all houses
      } else if (pathname === "/houses/rent" || forRent) {
        return house.availability.forRent;
      } else if (pathname === "/houses/buy" || forSale) {
        return house.availability.forSale;
      } else {
        return false;
      }
    });
  }, [
    houses,
    pathname,
    forRent,
    forSale
  ]);

  const resetToFirstPage = useCallback(() => {
    currentPage.current = 1;
  }, []);

  const hasFilters = useCallback(() => {
    return (
      search.trim() !== "" ||
      forRent ||
      forSale ||
      minPrice > 0 ||
      maxPrice > 0 ||
      beds > 0 ||
      bath > 0 ||
      area ||
      city ||
      country ||
      houseType.length > 0 ||
      features.length > 0 ||
      squareAreaMin > 0 ||
      squareAreaMax > 0
    );
  }, [
    search, forRent, forSale, minPrice, maxPrice, 
    beds, bath, area, city, country, 
    houseType, features, squareAreaMin, squareAreaMax
  ]);



   // Create a debounced fetch function
  const fetchHouses = useCallback(
    debounce(() => {
      if (hasFilters()) {
        dispatch(
          searchFiltersFetched(
            currentPage.current,
            limit,
            search,
            country,
            forRent,
            forSale,
            minPrice,
            maxPrice,
            beds,
            bath,
            area,
            city,
            houseType,
            features,
            squareAreaMin,
            squareAreaMax
          )
        );
      } else {
        dispatch(fetchedHouses(currentPage.current, limit));
      }
    }, 300),
    [
      dispatch, hasFilters, limit, search, country, forRent, forSale,
      minPrice, maxPrice, beds, bath, area, city,
      houseType, features, squareAreaMin, squareAreaMax
    ]
  );

  const handlePageClick = useCallback((e) => {
    currentPage.current = e.selected + 1;
    window.scrollTo(0, 0);
    fetchHouses();
  }, [fetchHouses]);

  const houseData = useCallback(async () => {
    setIsLoading(true);
    try {
       // Handle navigation state
      if (state?.search && state.results) {
        setSearch(state.search);
        setSearchResult(state.results);

        dispatch(
          searchFiltersFetched(
            1,
            9,
            state.search
          )
        );

        // Clear the state after using it - IMPORTANT to prevent infinite loops
        navigate(pathname, { replace: true, state: null });
      } else if (state?.country) {
        setCountry(state.country);

        dispatch(
          searchFiltersFetched(
            1,
            9,
            "",
            state.country
          )
        );

        navigate(pathname, { replace: true, state: null });
      } else {
        // No special state, just fetch houses normally
        window.scrollTo(0, 0);
        resetToFirstPage();
        fetchHouses();
      }
    } catch (error) {
      console.error("Error fetching house data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, fetchHouses, navigate, pathname, resetToFirstPage, state]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    
    if (state?.search || state?.country) {
      houseData();
    }
  }, [pathname, state, houseData]);

  useEffect(() => {
    // Skip the first render since LandingPage already fetched
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    houseData();
  }, [
    forRent,
    forSale,
    minPrice,
    maxPrice,
    beds,
    bath,
    area,
    city,
    country,
    houseType,
    features,
    squareAreaMin,
    squareAreaMax,
    pageCount,
    searchDisplay,
    searchResult,
    state,
  ]);

  useEffect(() => {
    if (!message && allHouses.length > 0) {
      setHouses(allHouses); // Update the houses state with fetched data
    } else {
      // const paginationBtn = document.querySelector('.pagination-button');
      // paginationBtn.style.display = 'none';
      // window.scrollTo(0, 0);
    }
    checkHighestPrice();
  }, [allHouses, message,checkHighestPrice]);

  return (
    <div className="container-houses">
      <MemoizedSearch
        currentPage={currentPage.current}
        limit={limit}
        searchHouses={search}
        setSearchHouses={setSearch}
        check
        houseList={houses}
        setResult={setSearchResult}
        result={searchResult}
        forRent={forRent}
        forSale={forSale}
        handleAvailabilityClick={handleAvailabilityClick}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        calculateMinPrice={calculateMinPrice}
        bedRoom={beds}
        setBedRoom={setBeds}
        bathRoom={bath}
        setBathRoom={setBath}
        area={area}
        setArea={setArea}
        filterArea={filterArea}
        city={city}
        setCity={setCity}
        filterCity={filterCity}
        country={country}
        filterCountry={filterCountry}
        houseType={houseType}
        houseTypeFilter={houseTypeFilter}
        features={features}
        featureHouseFilter={featureHouseFilter}
        squareAreaMin={squareAreaMin}
        squareAreaMax={squareAreaMax}
        squareAreaRange={squareAreaRange}
        handlePageClick={handlePageClick}
        setSearchDisplay={setSearchDisplay}
      />

      <MemoizedHouseCards
        filteredHouse={filteredHouse}
        noResults={message}
        skip={skip}
        limit={limit}
        isLoading={isLoading}
        handleFavourites={handleFavourites}
        handlePageClick={handlePageClick}
        pageCount={pageCount}
        currentPage={currentPage}
      />

      <div className="pagination-button">
        {!message && (
          <ReactPaginate
            breakLabel={"..."}
            nextLabel={"next >"}
            onPageChange={handlePageClick}
            marginPagesDisplayed={2}
            pageRangeDisplayed={4}
            pageCount={pageCount}
            previousLabel={"< previous"}
            renderOnZeroPageCount={null}
            forcePage={currentPage.current - 1}
            // bootstrap class names
            containerClassName={"pagination justify-content-center my-4"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        )}
      </div>
    </div>
  );
}

export default HouseList;
