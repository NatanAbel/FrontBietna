import { useDispatch, useSelector } from "react-redux";
import { selectFavs, selecthouses } from "../store/houses/selectors";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchedHouses } from "../store/houses/thunks";
// import HouseCards from "../component/HouseCards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { toggleFavorites } from "../store/houses/slice";
import Search from "../component/Search";

const API_URL = "http://localhost:5005/images";

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
  const [beds, setBeds] = useState(0);
  const [bath, setBath] = useState(0);
  const [maxHousePrice, setMaxHousePrice] = useState(false);

  const { houses, favorites } = house;
  const { pathname } = location;
  // sorting houses based in the compare_name function above the component function
  const sortedHouses = [...houses].sort(compare_name);

  // handeling price range of the houses
  const housePriceInRange = (house, min, max) => {
    const housePrice = house.availability.forRent
      ? house.rentalPrice
      : house.price;

    if (min >= max) {
      return housePrice >= min;
    } else {
      return housePrice >= min && housePrice <= max;
    }
  };
  console.log("forRent..........45",forRent)
  // function that checks if the house price range is above the highest price
  const checkHighestPrice = () => {
    // storring all house prices in a variable
    let allHousesPrice = [];

    // filtering based on the status of houses and store its price to allHousesPrice array
    const availabilitiesPrice = sortedHouses.filter((hou) => {
      if (forRent && hou.availability.forRent) {
        return allHousesPrice.push(hou.rentalPrice);
      } else if (forSale && hou.availability.forSale) {
        return allHousesPrice.push(hou.price);
      }
    });

    // A condition that checks if allHousesPrice array is not empty and avoids Math.max() from having infinity result
    if (allHousesPrice.length > 0) {
      const highestPrice = Math.max(...allHousesPrice);
      // console.log("minPrice,,,,,,,,,,,,", minPrice);
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
        // setMaxPrice(0)
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
      setMaxPrice(0)
    }
  };

  // filtering sorted houses based on conditions
  const filteredHouse = sortedHouses.filter((house) => {
    // condditions to display search results or houses based on the current location.
    if (pathname === "/houses/allHouses") {
      setForRent(false);
      setForSale(false);
      return search !== "" && result.length > 0
        ? result.includes(house)
        : true && housePriceInRange(house, minPrice, maxPrice);
    } else if (pathname === "/houses/rent" || forRent) {
      if (minPrice >= 0 && maxPrice >= 0) {
        return (
          house.availability.forRent &&
          housePriceInRange(house, minPrice, maxPrice)
        );
      } else {
        return house.availability.forRent;
      }
    } else if (pathname === "/houses/buy" || forSale) {
      if (minPrice >= 0 && maxPrice >= 0) {
        return (
          house.availability.forSale &&
          housePriceInRange(house, minPrice, maxPrice)
        );
      } else {
        return house.availability.forSale;
      }
    } else {
      console.log("Could not find");
    }
  });
  console.log("filteredHouse,,,,,,,,,,,,", filteredHouse);
  // const filterHouses = () => {
  //   if (pathname === "/houses/allHouses") {
  //     return search !== "" && result.length > 0
  //       ? sortedHouses.filter((house) => result.includes(house))
  //       : sortedHouses;
  //   }else if (pathname === "/houses/rent" || forRent) {
  //     return sortedHouses.filter((house) => house.availability.forRent);
  //   } else if (pathname === "/houses/buy" || forSale) {
  //     return sortedHouses.filter((house) => house.availability.forSale);
  //   } else {
  //     console.log("Could not find");
  //   }
  // };

  // const filteredHouse = filterHouses();


  useEffect(() => {
    dispatch(fetchedHouses);
    setIsLoading(false);
    checkHighestPrice();
    const { state } = location;
    // Check for location state to set initial search and results
    if (state && state.search && state.results) {
      setSearch(state.search);
      setResult(state.results);
      console.log("state....", state);
    }
  }, [dispatch, location, minPrice, maxPrice]);

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
        // setForRent={setForRent}
        // setForSale = {setForSale}
        setForRent={(value) => {
          setForRent(value);
          if (value) {
            calculateMinPrice("forRent");
          }
        }}
        // forSale={forSale}
        setForSale={(value) => {
          setForSale(value);
          if (value) {
            calculateMinPrice("forSale");
          }
        }}
        handleAvailabilityClick={handleAvailabilityClick}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      <div className="house-cards">
        {maxHousePrice ? (
          <div className="">
            {" "}
            <h1>No houses found within the specified price range. Please adjust your search criteria.</h1>{" "}
          </div>
        ) : !isLoading ? 
          filteredHouse.length === 0 ? (
            <div className="">
              <h1>No houses found within the specified price range. Please adjust your maximum price.</h1>
            </div>
          ):(
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
                  src={`${API_URL}/${house.images[0]}`}
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
        ) : (
          <p>Loading....</p>
        )}
      </div>
    </div>
  );
}

export default HouseList;
