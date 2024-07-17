import { useDispatch, useSelector } from "react-redux";
import { selecthouses } from "../store/houses/selectors";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { fetchedHouses, searchFiltersFetched } from "../store/houses/thunks";
// import HouseCards from "../component/HouseCards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
// import { toggleFavorites } from "../store/houses/slice";
import Search from "../component/Search";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {
  selectFavs,
  selectIsAuthenticated,
  selectUser,
} from "../store/auth/selectors";
import { toggleFavorites, updateUser } from "../store/auth/slice";

const API_URL_IMG = "http://localhost:5005/images";
const API_URL_HOUSE = "http://localhost:5005/houses";
const API_URL = import.meta.env.VITE_BACK_URL;

const compare_name = (player_a, player_b) => {
  return player_a.address.localeCompare(player_b.address);
};

function HouseList({
  forRent,
  setForRent,
  forSale,
  setForSale,
  handleAvailabilityClick,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // const [isLike, setIsLike] = useState(false);
  const house = useSelector(selecthouses);
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [beds, setBeds] = useState(1);
  const [bath, setBath] = useState(1);
  const [maxHousePrice, setMaxHousePrice] = useState(false);
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [houseType, setHouseType] = useState([]);
  const [noResults, setNoResults] = useState("");
  const [features, setFeatures] = useState([]);
  const [squareAreaMin, setSquareAreaMin] = useState(0);
  const [squareAreaMax, setSquareAreaMax] = useState(0);
  const [limit, setLimit] = useState(3);
  // const currentPage = useRef(1);
  // const [currentPage, setCurrentPage] = useState(1);
  const[houses, setHouses] = useState([])

  const currentPage = useRef(1);
  
  const { allHouses, pageCount} = house;
  
  // Skip variable with 0 value uses as the first argument of silce method to display houses
  const skip = 0

  const { state ,pathname } = location;
  // sorting houses based in the compare_name function above the component function
  const sortedHouses = [...houses].sort(compare_name);

  // handeling price range of the houses
  const housePriceRange = (house, min, max) => {
    const housePrice = house.availability.forRent
      ? house.rentalPrice
      : house.price;

    if (min >= max) {
      return housePrice >= min;
    } else {
      return housePrice >= min && housePrice <= max;
    }
  };

  const bedRoomRange = (house, beds) => {
    return house.bedrooms >= beds;
  };

  const bathRoomRange = (house, bath) => {
    return house.bathrooms >= bath;
  };

  const filterArea = (chosenArea) => {
    // checking if the selected area by removing all spaces from the string
    // const areaResult = sortedHouses.filter(
    //   (house) =>
    //     house.address.replace(/\s/g, "") === chosenArea.replace(/\s/g, "")
    // );
    // console.log("area..........",areaResult)
    // A condition used to filter area incase the user wants different area and set the search field to the chosen area to avoid confusion for the user.
    if(chosenArea === "none"){
      setArea("")
      setCity("")
      // setResult([]);
    }
    // else if (areaResult.length > 0 && search !== "") {
      // const addCity = areaResult.filter(area => area.city)
      // setArea(chosenArea);
      // setSearch(chosenArea.toLowerCase());
      // setResult(areaResult);
      // setCity(addCity[0].city);
    // }
    else{
      // const addCity = areaResult.filter(area => area.city)
      setArea(chosenArea);
      // setSearch("");
      // setResult(areaResult);
      // setCity(addCity[0].city);
    }
  };
  
  const filterCity = (chosenCity) => {
    // checking if the selected area by removing all spaces from the string
    // const cityResult = sortedHouses.filter(
    //   (house) => house.city.replace(/\s/g, "") === chosenCity.replace(/\s/g, "")
    // );
    if(chosenCity === "none"){
      setCity("")
    }else{
      setCity(chosenCity);
    }
    // console.log("cityResult......", cityResult);
  };



  const houseTypeFilter = (selectedType) => {
    // Check if the clicked feature is already in the enumHouseType array
    const isHouseTypeSelected = houseType.includes(selectedType);

    if (!isHouseTypeSelected) {
      // If the feature is not selected, add it to the enumHouseType array
      setHouseType([...houseType, selectedType]);
    } else {
      // If the feature is already selected, remove it from the enumHouseType array
      const disselectedType = houseType.filter((type) => type !== selectedType);
      setHouseType(disselectedType);
    }
  };

  const featureHouseFilter = (selectedFeature) => {
    // Check if the clicked feature is already in the enumHouseType array
    const isFeatureSelected = features.includes(selectedFeature);

    if (!isFeatureSelected) {
      // If the feature is not selected, add it to the enumHouseType array
      setFeatures([...features, selectedFeature]);
    } else {
      // If the feature is already selected, remove it from the enumHouseType array
      const disselectedFeatures = features.filter(
        (feature) => feature !== selectedFeature
      );
      setFeatures(disselectedFeatures);
    }
  };

  // handeling square area range of the houses
  const squareAreaRange = (value, isMin) => {
    if (isMin === "minSqm") {
      setSquareAreaMin(value);
    } else if (isMin === "maxSqm") {
      setSquareAreaMax(value);
    }
  };

  // function that checks if the house price range is above the highest price
  const checkHighestPrice = () => {
    // storring all house prices in a variable
    let allHousesPrice = [];

    // filtering based on the status of houses and store its price to allHousesPrice array
    const availabilitiesPrice = sortedHouses.filter((house) => {
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
  };

  // setting the minimum price of forSale and forRent based on the user clicks on the price dropdown
  const calculateMinPrice = (availability) => {
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
      const houseMinPrice = Math.min(
        ...availableHouses.map((house) =>
          house.availability.forRent ? house.rentalPrice : house.price
        )
      );
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
      // setSearch("")
    }
  };

  // Define filter functions
  const filterAllHouses = (house) => {
    // setForRent(false);
    // setForSale(false);
    return search !== "" && searchResult.length > 0
      ? searchResult.some(result=> result.address === house.address)
      : true && house &&
          housePriceRange(house, minPrice, maxPrice) && bedRoomRange(house, beds) &&
          bathRoomRange(house, bath) &&
          (area === "" || house.address === area) &&
          (city === "" || house.city === city) &&
          (houseType.length === 0 || houseType.includes(house.homeType)) &&
          (features.length === 0 ||
            features.every((feature) => house.features.includes(feature))) &&
          (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
          (squareAreaMax === 0 || house.sqm <= squareAreaMax);
  };

  const filterRentHouses = (house) => {
    
    if(search !== "" && searchResult.length > 0 && house.availability.forRent){
      return (searchResult.some(result=> result.address === house.address) && housePriceRange(house, minPrice, maxPrice) && bedRoomRange(house, beds) &&
      bathRoomRange(house, bath) &&
      (area === "" || house.address === area) &&
      (city === "" || house.city === city) &&
      (houseType.length === 0 || houseType.includes(house.homeType)) &&
      (features.length === 0 ||
        features.every((feature) => house.features.includes(feature))) &&
      (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
      (squareAreaMax === 0 || house.sqm <= squareAreaMax)
    );      
    }else if (minPrice >= 0 && maxPrice >= 0) {
      return (
        house.availability.forRent &&
        housePriceRange(house, minPrice, maxPrice) &&
        bedRoomRange(house, beds) &&
        bathRoomRange(house, bath) &&
        (area === "" || house.address === area) &&
        (city === "" || house.city === city) &&
        (houseType.length === 0 || houseType.includes(house.homeType)) &&
        (features.length === 0 ||
          features.every((feature) => house.features.includes(feature))) &&
        (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
        (squareAreaMax === 0 || house.sqm <= squareAreaMax)
      );
    } else if (beds > 1 || bath > 1) {
      return (
        house.availability.forRent &&
        bedRoomRange(house, beds) &&
        bathRoomRange(house, bath) &&
        (area === "" || house.address === area) &&
        (city === "" || house.city === city) &&
        (houseType.length === 0 || houseType.includes(house.homeType)) &&
        (features.length === 0 ||
          features.every((feature) => house.features.includes(feature))) &&
        (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
        (squareAreaMax === 0 || house.sqm <= squareAreaMax)
      );
    } else if (area === "" || house.address === area) {
      return (
        house.availability.forRent &&
        bedRoomRange(house, beds) &&
        bathRoomRange(house, bath) &&
        (area === "" || house.address === area) &&
        (city === "" || house.city === city) &&
        (houseType.length === 0 || houseType.includes(house.homeType)) &&
        (features.length === 0 ||
          features.every((feature) => house.features.includes(feature))) &&
        (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
        (squareAreaMax === 0 || house.sqm <= squareAreaMax)
      );
    } else if (city === "" || house.city === city) {
      return house.availability.forRent;
    } else if (houseType.length === 0 || houseType.includes(house.homeType)){
      return house.availability.forRent;
    } else if (squareAreaMin >= 0 && squareAreaMax >= 0) {
      return (
        house.availability.forRent &&
        house.sqm >= squareAreaMin &&
        house.sqm <= squareAreaMax &&
        housePriceRange(house, minPrice, maxPrice) &&
        bedRoomRange(house, beds) &&
        bathRoomRange(house, bath) &&
        (area === "" || house.address === area) &&
        (city === "" || house.city === city) &&
        (houseType.length === 0 || houseType.includes(house.homeType)) &&
        (features.length === 0 ||
          features.every((feature) => house.features.includes(feature)))
      );
    } else {
      return house.availability.forRent;
    }
  };

  const filterBuyHouses = (house) => {
    if(search !== "" && searchResult.length > 0 && house.availability.forSale){
      return (searchResult.some(result=> result.address === house.address) && housePriceRange(house, minPrice, maxPrice) && bedRoomRange(house, beds) &&
      bathRoomRange(house, bath) &&
      (area === "" || house.address === area) &&
      (city === "" || house.city === city) &&
      (houseType.length === 0 || houseType.includes(house.homeType)) &&
      (features.length === 0 ||
        features.every((feature) => house.features.includes(feature))) &&
      (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
      (squareAreaMax === 0 || house.sqm <= squareAreaMax)
    );      
    }else if (minPrice >= 0 && maxPrice >= 0) {
      return (
        house.availability.forSale &&
        housePriceRange(house, minPrice, maxPrice) &&
        bedRoomRange(house, beds) &&
        bathRoomRange(house, bath) &&
        (area === "" || house.address === area) &&
        (city === "" || house.city === city) &&
        (houseType.length === 0 || houseType.includes(house.homeType)) &&
        (features.length === 0 ||
          features.every((feature) => house.features.includes(feature))) &&
        (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
        (squareAreaMax === 0 || house.sqm <= squareAreaMax)
      );
    } else if (beds > 1 || bath > 1) {
      return (
        house.availability.forSale &&
        bedRoomRange(house, beds) &&
        bathRoomRange(house, bath) &&
        (area === "" || house.address === area) &&
        (city === "" || house.city === city) &&
        (houseType.length === 0 || houseType.includes(house.homeType)) &&
        (features.length === 0 ||
          features.every((feature) => house.features.includes(feature))) &&
        (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
        (squareAreaMax === 0 || house.sqm <= squareAreaMax)
      );
    } else if (area === "" || house.address === area) {
      return house.availability.forSale;
    } else if (city === "" || house.city === city) {
      return house.availability.forSale;
    } else if (houseType.length === 0 || houseType.includes(house.homeType)) {
      return house.availability.forSale;
    } else if (
      (squareAreaMin === 0 || house.sqm >= squareAreaMin) &&
      (squareAreaMax === 0 || house.sqm <= squareAreaMax)
    ) {
      return house.availability.forSale;
    } else {
      return house.availability.forSale;
    }
  };


  // Handle clicked favourites button
  const handleFavourites = async (houseId) => {
    const token = localStorage.getItem("token");
 
  const body = { favourites: houseId };

    try {
      const res = await axios.put(`${API_URL}/auth/profile`, body, {
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
  };

  // Memoize the filteredHouse variable using useMemo hook use to memoize the filtered house data based on the dependencies that cause the filtering to change.
  const filteredHouse = useMemo(() => {
    return (searchResult.length >0 ? searchResult : houses).filter((house) => {
      if (pathname === "/houses/allHouses" || !forRent && !forSale) {
        return filterAllHouses(house);
      } else if (pathname === "/houses/rent" || forRent) {
        return filterRentHouses(house);
      } else if (pathname === "/houses/buy" || forSale) {
        return filterBuyHouses(house);
      } else {
        return false;
      }
    });
  }, [
    houses,
    pathname,
    forRent,
    forSale,
    minPrice,
    maxPrice,
    beds,
    bath,
    area,
    city,
    user,
    squareAreaMin,
    squareAreaMax,
    searchResult,
  ]);

  const resetToFirstPage = () => {
    currentPage.current = 1
};

 

const hasFilters = () => {
  return (
    searchResult || forRent || forSale || minPrice > 0 || maxPrice > 0|| beds > 1 || bath > 1 || area || city || houseType.length > 0 || features.length > 0 || squareAreaMin >0 || squareAreaMax > 0
  );
};

const fetchHouses = () => {
  // const filters = hasFilters()
  // console.log("filters.........",hasFilters())
  if (hasFilters()) {
    dispatch(
      searchFiltersFetched(
        currentPage.current, limit,forRent, forSale, minPrice, maxPrice, beds, bath, area, city, houseType, features, squareAreaMin, squareAreaMax
      )
    );
  } else {
    dispatch(fetchedHouses(currentPage.current, limit));
  }
};

const handlePageClick = (e) => {
  currentPage.current = e.selected + 1
  fetchHouses()
};

useEffect(() =>{
  resetToFirstPage()
},[pathname, search, forRent, forSale, minPrice, maxPrice, beds, bath, area, city, houseType, features, squareAreaMin, squareAreaMax])

useEffect(() => {
  setIsLoading(false);
  fetchHouses();
}, [
  dispatch,forRent, forSale, minPrice, maxPrice, beds, bath, area, city, houseType, features, squareAreaMin, squareAreaMax,pageCount
]);

useEffect(() => {
  // Check if filteredHouse is empty and set noResults accordingly
  if (houses.length > 0) {
    setNoResults(""); // Clear the message if there are results  
   } else {
     setNoResults("No results found for the selected criteria.");
   }
    setHouses(allHouses)
    checkHighestPrice()
  }, [allHouses]);
  

  useEffect(() => {
    // const { state,pathname} = location;
    // Check for location state to set initial search and results
    if (state && state.search && state.results) {
      setSearch(state.search);
      setSearchResult(state.results);
      // Reset the location state to avoid retaining search data
    navigate(pathname, { replace: true, state: { search: "", results: [] } });
    }
  }, [pathname, state, navigate]);
  
  return (
    <div className="container-houses">
      <Search
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
        houseType={houseType}
        houseTypeFilter={houseTypeFilter}
        features={features}
        featureHouseFilter={featureHouseFilter}
        squareAreaMin={squareAreaMin}
        squareAreaMax={squareAreaMax}
        squareAreaRange={squareAreaRange}
        handlePageClick={handlePageClick}
      />

      <div className="house-cards">
        {noResults ? (
          <div>
            <h4>{noResults}</h4>
          </div>
        ) : (
            filteredHouse.slice(skip, skip + limit).map((house) => (
            <div className="card-container" key={house._id}>
              <div className="card-img">
                {isAuthenticated ? (
                  <button
                    className="btn-faHeart"
                    onClick={() => handleFavourites(house._id)}
                  >
                    {user.favorites.includes(house._id) ? "🖤" : "🤍"}
                  </button>
                ) : (
                  <Link className="btn-faHeart" to="/login">
                    🤍
                  </Link>
                )}
                <p className="card-img-text">
                  {house.availability.forRent ? "For rent" : "For Seal"}
                </p>
                <img
                  src={`${API_URL_IMG}/${house.images[0]}`}
                  alt="House image"
                  loading="lazy"
                />
              </div>

              <div className="card-body">
                <Link
                  to={`/housesDetails/${house._id}`}
                  className="house-cards-like"
                >
                  <h1>{house.address}</h1>
                  <p>
                    <span>
                      $
                      {house.availability.forRent
                        ? house.rentalPrice
                        : house.price}
                    </span>
                  </p>
                  <div className="card-info">
                    <p>Bathrooms: {house.bathrooms}</p>
                    <p>Bedrooms: {house.bedrooms}</p>
                    <p>sqm: {house.sqm}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
      <ReactPaginate
        breakLabel={"..."}
        nextLabel={"next >"}
        onPageChange={handlePageClick}
        marginPagesDisplayed={2}
        pageRangeDisplayed={4}
        pageCount={searchResult.length > 0 ? Math.ceil(searchResult.length/limit) : pageCount}
        previousLabel={"< previous"}
        renderOnZeroPageCount={null}
        forcePage={currentPage.current -1 }
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
    </div>
  );
}

export default HouseList;
