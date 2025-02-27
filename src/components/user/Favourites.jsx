import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectIsAuthenticated } from "../../store/auth/selectors";
import DOMPurify from "dompurify";
import { debounce } from "lodash";

// Escape HTML for additional safety
const escapeHTML = (unsafe) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function Favourites({ user, favourites, handleFavBtn }) {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);


  // Debounce the favorite toggle action to prevent spamming
  const debouncedHandleFav = useMemo(
    () =>
      debounce((houseId) => {
        if (isAuthenticated && houseId) {
          handleFavBtn(houseId);
        } else {
          console.error("Unauthorized action or invalid house ID.");
        }
      }, 500), // Limit to one action per 500ms
    [handleFavBtn, isAuthenticated]
  );

  useEffect(() => {
    return () => {
      debouncedHandleFav.cancel(); // Cancel any pending debounced calls on unmount
    };
  }, [debouncedHandleFav]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated, favourites]);

  if (isLoading) {
    return <p>loading.....</p>;
  }

  return (
    <div className="favs-house-cards">
      {/* Optional chaining (user?.favourites?.map) to safely access favourites only if user and user.favourites are defined. */}
      {favourites.length > 0 ? (
        favourites.map((house) => {
          const sanitizedImageUrl = house.images?.[0]
            ? DOMPurify.sanitize(house.images[0])
            : "/default-placeholder.jpg";

          return(<div className="card-container" key={house._id}>
            <div className="card-img">
              <button
                className="btn-faHeart"
                onClick={() => debouncedHandleFav(house._id)}
              >
                {favourites.includes(house._id) ? "🤍" : "🖤"}
              </button>
              <p className="card-img-text">
                {house?.availability?.forRent ? "For rent" : "For Sale"}
              </p>
              {house.images && house.images.length > 0 && (
                <img src={sanitizedImageUrl} alt="House image" loading="lazy" />
              )}
            </div>

            <div className="card-body">
              <Link
                to={`/housesDetails/${house._id}`}
                className="house-cards-link"
              >
                <h1>{escapeHTML(house.address || "No Address Available")}</h1>
                <p>
                  <span>
                    $
                    {house?.availability?.forRent
                        ? house.rentalPrice || "N/A"
                        : house.price || "N/A"}
                  </span>
                </p>
                <div className="card-info">
                  <p>Bathrooms: {house.bathrooms || 0}</p>
                  <p>Bedrooms: {house.bedrooms || 0}</p>
                  <p>sqm: {house.sqm || "N/A"}</p>
                </div>
              </Link>
            </div>
          </div>
        )
      })
      ) : (
        <p>You have no favorite house yet!</p>
      )}
    </div>
  );
}

export default Favourites;
