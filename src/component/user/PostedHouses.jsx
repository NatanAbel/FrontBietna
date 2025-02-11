import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsAuthenticated } from '../../store/auth/selectors';
import DOMPurify from "dompurify";
import { debounce } from "lodash";
import { useMemo } from 'react';

 // Escape HTML for additional safety
 const escapeHTML = (unsafe) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

function PostedHouses({publishedHouses, user, handleDeleteHouse}) {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Ensures that the handleDeleteHouse function is called at most once every second, even if the delete button is clicked multiple times. (Prevents Spamming)
  const debouncedDelete = useMemo(
    () =>
      debounce((houseId) => {
        if (user && houseId) {
          handleDeleteHouse(houseId);
        } else {
          console.error("Unauthorized deletion attempt or invalid house ID.");
        }
      }, 1000), // Rate limit to one call per second
    [handleDeleteHouse, user]
  );

  const handleDelete = (houseId, houseOwnerId) => {
    if (user && houseOwnerId === user._id) {
      debouncedDelete(houseId);
    } else {
      console.error("Unauthorized deletion attempt.");
    }
  };

  useEffect(() => {
    return () => {
      debouncedDelete.cancel(); // Cancel any pending debounced calls on unmount
    };
  }, [debouncedDelete]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoading(false);
    }
  }, [isAuthenticated,publishedHouses, user]);

  if (isLoading || !user) {
    return <p>loading.....</p>;
  }

  return (
    <div className="house-cards">
      {publishedHouses.length > 0 ? (
        publishedHouses.map((house) => {
          const sanitizedImageUrl = house.images?.[0]
            ? DOMPurify.sanitize(house.images[0])
            : "/default-placeholder.jpg";
          return (<div className="card-container" key={house._id}>
            <div className="card-img">
            <button
                    className="btn-faHeart"
                    onClick={() =>handleDelete(house._id, house.postedBy._id)}
                  >
                    <span>delete</span>
                  </button>
              <p className="card-img-text">
                {house.availability?.forRent ? "For rent" : "For Sale"}
              </p>
              <img
                src={sanitizedImageUrl}
                alt={escapeHTML("House image")}
                loading="lazy"
              />
            </div>

            <div className="card-body">
              <Link to={`/housesDetails/${house._id}`} className="house-cards-link">
                <h1>{escapeHTML(house.address || "No Address Available")}</h1>
                <p>
                  <span>
                    $
                    {house.availability?.forRent
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
        <p>You have no posted house yet!</p>
      )}
    </div>
  );
}

export default PostedHouses;