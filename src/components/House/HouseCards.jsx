import { selectIsAuthenticated, selectUser } from "../../store/auth/selectors";
import { useSelector } from "react-redux";
import { Circles } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBathtub,
  faBed,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types"; // For prop validation
import DOMPurify from "dompurify";

function HouseCards({
  filteredHouse = [],
  noResults = "",
  isLoading = false,
  skip = 0,
  limit = 10,
  handleFavourites,
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  // Validate house data structure
  const validateHouse = (house) => {
    return (
      house &&
      typeof house._id === "string" &&
      Array.isArray(house.images) &&
      house.images.length > 0 &&
      typeof house.address === "string" &&
      typeof house.sqm === "number" &&
      typeof house.bedrooms === "number" &&
      typeof house.bathrooms === "number" &&
      typeof house.availability?.forRent === "boolean" &&
      (house.rentalPrice || house.price) // At least one price must exist
    );
  };

    // Add this helper function to check if a house is favorited
  const isHouseFavorited = (houseId) => {
      if (!user?.favorites || !Array.isArray(user.favorites)) return false;
      return user.favorites.some(fav => fav._id === houseId);
    };

  return (
    <>
      {isLoading ? (
        <div className="isLoading" style={{ margin: "150px auto" }}>
          <Circles
            height="80"
            width="80"
            color="black"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : noResults ? (
        <div style={{ margin: "150px auto" }}>
          <h4>{DOMPurify.sanitize(noResults)}</h4>
        </div>
      ) : (
        <div className="house-cards">
          {filteredHouse.slice(skip, skip + limit).map((house) => (
            <div className="card-container" key={house._id}>
              <div className="card-img">
                {isAuthenticated ? (
                  <button
                  className="btn-faHeart"
                  onClick={() => handleFavourites(house._id)}
                  >
                    
                    {isHouseFavorited(house._id) ? "🖤" : "🤍"}
                  </button>
                ) : (
                  <Link className="btn-faHeart" to="/login">
                    🤍
                  </Link>
                )}
                <p className="card-img-text">
                  {DOMPurify.sanitize(
                    house.availability.forRent ? "For Rent" : "For Sale"
                  )}
                </p>
                <img
                  src={house.images[0]}
                  alt={`Image of house at ${DOMPurify.sanitize(house.address)}`}
                  loading="lazy"
                />
              </div>
              <div className="card-body">
                <Link
                  to={`/housesDetails/${house._id}`}
                  className="house-cards-link"
                >
                  <h1>{DOMPurify.sanitize(house.address)}</h1>
                  <p>
                    <span>
                      $
                      {house.availability.forRent
                        ? house.rentalPrice.toLocaleString()
                        : house.price.toLocaleString()}
                    </span>
                  </p>
                  <div className="card-info">
                    <p>
                      Baths:
                      <FontAwesomeIcon
                        icon={faBathtub}
                        // className="details-icon"
                      />{" "}
                      {house.bathrooms}
                    </p>
                    <p>
                      Beds:
                      <FontAwesomeIcon
                        icon={faBed}
                        // className="details-icon"
                      />{" "}
                      {house.bedrooms}
                    </p>
                    <p>
                      sqm:
                      <FontAwesomeIcon
                        icon={faRulerCombined}
                        // className="details-icon"
                      />{" "}
                      {house.sqm} m²
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// Prop validation to ensure correct data structure and type of props passed to the HouseCards component.
HouseCards.propTypes = {
  filteredHouse: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      images: PropTypes.arrayOf(PropTypes.string).isRequired,
      address: PropTypes.string.isRequired,
      sqm: PropTypes.number.isRequired,
      bedrooms: PropTypes.number.isRequired,
      bathrooms: PropTypes.number.isRequired,
      availability: PropTypes.shape({
        forRent: PropTypes.bool.isRequired,
      }),
      rentalPrice: PropTypes.number,
      price: PropTypes.number,
    })
  ),
  noResults: PropTypes.string,
  isLoading: PropTypes.bool,
  skip: PropTypes.number,
  limit: PropTypes.number,
  handleFavourites: PropTypes.func.isRequired,
};

export default HouseCards;
