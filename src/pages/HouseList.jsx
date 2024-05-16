import { useDispatch, useSelector } from "react-redux";
import { selectFavs, selecthouses } from "../store/houses/selectors";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState,useMemo, useRef } from "react";
import { fetchedHouses } from "../store/houses/thunks";
// import HouseCards from "../component/HouseCards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { toggleFavorites } from "../store/houses/slice";
import Search from "../component/Search";
import ReactPaginate from "react-paginate";
import axios from "axios";

const API_URL_IMG = "http://localhost:5005/images";
const API_URL_HOUSE = "http://localhost:5005/houses"

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
  // const favs = useSelector(selectFavs)
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [beds, setBeds] = useState(1);
  const [bath, setBath] = useState(1);
  const [maxHousePrice, setMaxHousePrice] = useState(false);
  const [area, setArea] = useState("");
  const [city, setCity] = useState("");
  const [houseType, setHouseType] = useState([])
  const [noResults, setNoResults] = useState("")
  const [features, setFeatures] = useState([])
  const [squareAreaMin, setSquareAreaMin] = useState(0);
  const [squareAreaMax, setSquareAreaMax] = useState(0);
  const [limit, setLimit] = useState(5)
  const [pageCount, setPageCount] = useState(1)
  const currentPage = useRef()


  
  const { houses, favorites} = house;
  console.log("houses......3333",house)
  const { pathname } = location;
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
    return house.bedrooms >= beds
  };

  const bathRoomRange = (house,bath)=>{
    return house.bathrooms >= bath
  }

  const filterArea = (chosenArea) => {
      // checking if the selected area by removing all spaces from the string
        const areaResult = sortedHouses.filter((house) => house.address.replace(/\s/g, "") === chosenArea.replace(/\s/g, ""))
        if (areaResult.length > 0){
          setArea(chosenArea)
          return areaResult
        }
  
  }

  const filterCity = (chosenCity) => {
    // checking if the selected area by removing all spaces from the string
      const cityResult = sortedHouses.filter((house) => house.city.replace(/\s/g, "") === chosenCity.replace(/\s/g, ""))
      if (cityResult.length > 0){
        setCity(chosenCity)
        return cityResult
      }

}

  const houseTypeFilter = (selectedType) => {
     // Check if the clicked feature is already in the enumHouseType array
     
     const isHouseTypeSelected = houseType.includes(selectedType);
  
     if (!isHouseTypeSelected) {
       // If the feature is not selected, add it to the enumHouseType array
       setHouseType([...houseType, selectedType]);
     } else {
       // If the feature is already selected, remove it from the enumHouseType array
       const disselectedType = houseType.filter((type) => type !== selectedType)
       setHouseType(disselectedType)
     }
    }


  const featureHouseFilter = (selectedFeature) => {
     // Check if the clicked feature is already in the enumHouseType array
     const isFeatureSelected = features.includes(selectedFeature);

     if (!isFeatureSelected) {
       // If the feature is not selected, add it to the enumHouseType array
       setFeatures([...features, selectedFeature]);
     } else {
       // If the feature is already selected, remove it from the enumHouseType array
       const disselectedFeatures = features.filter((feature) => feature !== selectedFeature)
       setFeatures(disselected);
     }
    }

  // handeling square area range of the houses
  const squareAreaRange = (value, isMin) => {
      if(isMin === "minSqm"){
        setSquareAreaMin(value);
      }else if(isMin === "maxSqm"){
        setSquareAreaMax(value);
      }
};
console.log("squareAreaMin...",squareAreaMin)
console.log("squareAreaMin...",squareAreaMax)

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
      }
      return false;
    });

    if (availableHouses.length > 0) {
      const houseMinPrice = Math.min(
        ...availableHouses.map((house) =>
          house.availability.forRent ? house.rentalPrice : house.price
        )
      );
      setMinPrice(houseMinPrice);
      setMaxPrice(0);
      setBath(1)
      setBeds(1)
      setArea("")
      setCity("")
      setHouseType([])
      setFeatures([])
      setSquareAreaMin(0)
      setSquareAreaMax(0)
    }
  };

  // // filtering sorted houses based on conditions
  // const filteredHouse = sortedHouses.filter((house) => {
  //   // condditions to display search results or houses based on the current location.
  //   if (pathname === "/houses/allHouses") {
  //     setForRent(false);
  //     setForSale(false);
  //     return search !== "" && result.length > 0
  //       ? result.includes(house)
  //       : true && housePriceRange(house, minPrice, maxPrice);
  //   } else if (pathname === "/houses/rent" || forRent) {
  //     if (minPrice >= 0 && maxPrice >= 0) {
  //       return (
  //         house.availability.forRent &&
  //         housePriceRange(house, minPrice, maxPrice) && bedRoomRange(house, beds) && bathRoomRange(house, bath)  && filterArea(house)
  //       );
  //     } else if (beds > 1 || bath > 1) {
  //       return house.availability.forRent && bedRoomRange(house, beds) && bathRoomRange(house, bath);
  //     } else if(house.address === area){
  //       return house.availability.forRent && filterArea(house)
  //     }else {
  //       return house.availability.forRent;
  //     }
  //   } else if (pathname === "/houses/buy" || forSale) {
  //     if (minPrice >= 0 && maxPrice >= 0) {
  //       return (
  //         house.availability.forSale &&
  //         housePriceRange(house, minPrice, maxPrice) && bedRoomRange(house, beds) && bathRoomRange(house, bath) && filterArea(house)
  //       );
  //     } else if (beds > 1 || bath > 1) {
  //       return house.availability.forSale && bedRoomRange(house, beds) && bathRoomRange(house, bath);
  //     } else if(house.address === area){
  //       return house.availability.forSale && filterArea(house)
  //     }else {
  //       return house.availability.forSale;
  //     }
  //   } else {
  //     console.log("Could not find");
  //   }
  // });
  // console.log("filteredHouse,,,,,,,,,,,,", filteredHouse);
 


  // Define filter functions
const filterAllHouses = (house) => {
  setForRent(false);
  setForSale(false);
  return (
    search !== "" && result.length > 0
    ? result.includes(house)
    : true && housePriceRange(house, minPrice, maxPrice) &&
    (area === "" || house.address === area) && (city === "" || house.city === city) && (houseType.length === 0 || houseType.includes(house.homeType)) && (features.length === 0 || features.every(feature => house.features.includes(feature))) && (squareAreaMin === 0 || house.sqm >= squareAreaMin) && (squareAreaMax === 0 || house.sqm <= squareAreaMax)
  );
};

const filterRentHouses = (house) => {
  if (minPrice >= 0 && maxPrice >= 0) {
    return (
      house.availability.forRent &&
      housePriceRange(house, minPrice, maxPrice) &&
      bedRoomRange(house, beds) &&
      bathRoomRange(house, bath) &&
      (area === "" || house.address === area) && (city === "" || house.city === city) && (houseType.length === 0 || houseType.includes(house.homeType)) && (features.length === 0 || features.every(feature => house.features.includes(feature))) && (squareAreaMin === 0 || house.sqm >= squareAreaMin) && (squareAreaMax === 0 || house.sqm <= squareAreaMax)
    );
  } else if (beds > 1 || bath > 1) {
    return (
      house.availability.forRent && bedRoomRange(house, beds) && bathRoomRange(house, bath) &&
    (area === "" || house.address === area) && (city === "" || house.city === city) && (houseType.length === 0 || houseType.includes(house.homeType)) && (features.length === 0 || features.every(feature => house.features.includes(feature))) && (squareAreaMin === 0 || house.sqm >= squareAreaMin) && (squareAreaMax === 0 || house.sqm <= squareAreaMax)
  );
  } else if (area === "" || house.address === area) {
    return house.availability.forRent && bedRoomRange(house, beds) && bathRoomRange(house, bath) &&
    (area === "" || house.address === area) && (city === "" || house.city === city) && (houseType.length === 0 || houseType.includes(house.homeType)) && (features.length === 0 || features.every(feature => house.features.includes(feature))) && (squareAreaMin === 0 || house.sqm >= squareAreaMin) && (squareAreaMax === 0 || house.sqm <= squareAreaMax)
  }else if (city === "" || house.city === city) {
    return house.availability.forRent 
  }else if (houseType.length === 0 || houseType.includes(house.homeType)) {
    return house.availability.forRent 
  }else if (squareAreaMin >= 0 &&  squareAreaMax >= 0) {
    return (
      house.availability.forRent && (house.sqm >= squareAreaMin) && (house.sqm <= squareAreaMax) &&
      housePriceRange(house, minPrice, maxPrice) &&
      bedRoomRange(house, beds) &&
      bathRoomRange(house, bath) &&
      (area === "" || house.address === area) && (city === "" || house.city === city) && (houseType.length === 0 || houseType.includes(house.homeType)) && (features.length === 0 || features.every(feature => house.features.includes(feature))) 
    ) 
  }else {
    return house.availability.forRent;
  }
};

const filterBuyHouses = (house) => {
  
  if (minPrice >= 0 && maxPrice >= 0 ) {
    return (
      house.availability.forSale &&
      housePriceRange(house, minPrice, maxPrice) &&
      bedRoomRange(house, beds) &&
      bathRoomRange(house, bath) &&
      (area === "" || house.address === area) && (city === "" || house.city === city) && (houseType.length === 0 || houseType.includes(house.homeType)) && (features.length === 0 || features.every(feature => house.features.includes(feature))) && (squareAreaMin === 0 || house.sqm >= squareAreaMin) && (squareAreaMax === 0 || house.sqm <= squareAreaMax)
    );
  } else if (beds > 1 || bath > 1) {
    return (
      house.availability.forSale && bedRoomRange(house, beds) && bathRoomRange(house, bath) &&
    (area === "" || house.address === area) && (city === "" || house.city === city) && (houseType.length === 0 || houseType.includes(house.homeType)) && (features.length === 0 || features.every(feature => house.features.includes(feature))) && (squareAreaMin === 0 || house.sqm >= squareAreaMin) && (squareAreaMax === 0 || house.sqm <= squareAreaMax)
  );

  } else if (area === "" || house.address === area) {
    return house.availability.forSale 
  } else if (city === "" || house.city === city) {
    return house.availability.forSale 
  }else if (houseType.length === 0 || houseType.includes(house.homeType)) {
    return house.availability.forSale 
  }else if ((squareAreaMin === 0 || house.sqm >= squareAreaMin) && (squareAreaMax === 0 || house.sqm <= squareAreaMax)) {
    return house.availability.forSale 
  }else {
    return house.availability.forSale;
  }
};

// Memoize the filteredHouse variable using useMemo hook use to memoize the filtered house data based on the dependencies that cause the filtering to change.
const filteredHouse = useMemo(() => {
  return sortedHouses.filter((house) => {
    if (pathname === "/houses/allHouses") {
      return filterAllHouses(house);
    } else if (pathname === "/houses/rent" || forRent) {
      return filterRentHouses(house);
    } else if (pathname === "/houses/buy" || forSale) {
      return filterBuyHouses(house);
    } else {
      return false;
    }   
  });
}, [sortedHouses, pathname, forRent, forSale, minPrice, maxPrice, beds, bath, area, city, favorites, squareAreaMin, squareAreaMax]);

const handlePageClick = (e) => {
  console.log("e.selected.....", e.selected);
  const selectedPage = e.selected + 1;
  console.log("currentPage.current...", selectedPage);
  // dispatch(fetchedHouses(selectedPage, limit));
};

console.log("limit...", limit)
console.log("pageCount...", pageCount)

//Pagination
// const paginatedResult = async()=> {
//   try{
//       const response = await axios.get(`${API_URL_HOUSE}/paginatedHouse?page=${currentPage.current}&limit=${limit}`)
//       setPageCount(response.data.pageCount)
//   }catch(e){
//       console.log(e.message)
//   }
// } 

  useEffect(() => {
    currentPage.current = 1;
    dispatch(fetchedHouses);
    setIsLoading(false);
    checkHighestPrice();
  }, [dispatch]);

  useEffect(() => {
    // Check if filteredHouse is empty and set noResults accordingly
    if (filteredHouse.length === 0) {
      setNoResults("No results found for the selected criteria.");
    } else {
      setNoResults(""); // Clear the message if there are results
    }
  }, [filteredHouse]);

  useEffect(()=>{
    const { state} = location;
    // Check for location state to set initial search and results
    if (state && state.search && state.results) {
      setSearch(state.search);
      setResult(state.results);
    }
  },[location, minPrice, maxPrice])

  return (
    <div className="container-houses">
      <Search
        searchHouses={search}
        setSearchHouses={setSearch}
        check
        houseList={houses}
        setResult={setResult}
        result={result}
        forRent={forRent}
        forSale={forSale}
        handleAvailabilityClick={handleAvailabilityClick}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        calculateMinPrice={calculateMinPrice} 
        bedRoom = {beds}
        setBedRoom={setBeds}
        bathRoom = {bath}
        setBathRoom={setBath}
        area = {area}
        filterArea = {filterArea}
        city = {city}
        filterCity = {filterCity}
        houseType = {houseType}
        houseTypeFilter={houseTypeFilter}
        features = {features}
        featureHouseFilter = {featureHouseFilter}
        squareAreaMin = {squareAreaMin}
        squareAreaMax = {squareAreaMax}
        squareAreaRange = {squareAreaRange}
      />

      <div className="house-cards">
        { noResults? <div><h4>{noResults}</h4></div>:(
          filteredHouse.map((house) => (
            <div className="card-container" key={house._id}>
              <div className="card-img">
                <button
                  className="btn-faHeart"
                  onClick={() => dispatch(toggleFavorites(house._id))}
                >
                  {favorites.includes(house._id) ? "🖤" : "🤍"}
                </button>
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
        pageCount={pageCount}
        previousLabel={"< previous"}
        renderOnZeroPageCount={null}
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
