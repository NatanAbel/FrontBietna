import { useDispatch, useSelector } from "react-redux";
import { selectFavs, selecthouses } from "../store/houses/selectors";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchedHouses } from "../store/houses/thunks";
// import HouseCards from "../component/HouseCards"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeartbeat } from "@fortawesome/free-solid-svg-icons";
import { toggleFavorites } from "../store/houses/slice";
// import Search from "../component/Search";

const compare_name = (player_a, player_b) => {
  return player_a.address.localeCompare(player_b.address);
};

function HouseList() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // const [isLike, setIsLike] = useState(false);
  const house = useSelector(selecthouses);
  // const favs = useSelector(selectFavs)
  const location = useLocation().pathname;
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [bath, setBath] = useState("");

  const { houses, favorites } = house;

  // sorting houses based in the compare_name function above the component function
  const sortedHouses = [...houses].sort(compare_name);

  console.log("sortedHouses......", sortedHouses);

  // filtering sorted houses based on conditions
  const filteredHouse = sortedHouses.filter((house) =>
    location === "/houses/allHouses"
      ? house
      : location === "/houses/rent"
      ? house.availability.forRent
      : house.availability.forSale
  );
  
  const searchFilterHouse = filteredHouse.filter((house) => {
    return search === ""
      ? true
      : house.address.toLowerCase().includes(search.toLowerCase());
  });

  console.log("filteredHouse...1", filteredHouse);

  // const handleSubmit =(e)=>{
  //   e.preventDefault();

  //   houses.filter(house =>{
  //     if(search === ""){
  //       return true
  //     }else{
  //       console.log("search.....",house.address.toLowerCase().includes(search.toLowerCase()));
  //     }
  //   })

  // }

  useEffect(() => {
    dispatch(fetchedHouses);
    setIsLoading(false);
  }, [dispatch]);

  return (
    <div className="container-houses">
      {/* <form  className="form-wrapper">
          <Search searchHouses={search} setSearchHouses={setSearch} searchFilterHouse={searchFilterHouse}/>
          <div className="input-wrapper">
          <select >
            <option >For Rent</option>
            <option >For Sale</option>
          </select>
          </div>
          <div className="input-wrapper">
          <select >
            <option >Price</option>
          </select>
          </div>
          <div className="input-wrapper">
          <select >
            <option >Beds & Baths</option>
          </select>
          </div>
          <button type="submit">Apply</button>
        </form> */}
      <div className="house-cards">
        {!isLoading ? (
          searchFilterHouse.map((house) => (
            
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
                <img src={house.images[0]} alt="House image" />
              </div>

              <div className="card-body">
                <Link to={`/housesDetails/${house._id}`} className="house-cards-like">
                  <h1>{house.address}</h1>
                  <p>
                    <span>${house.price}</span>
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
