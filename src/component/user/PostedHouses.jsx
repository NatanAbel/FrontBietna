import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectIsAuthenticated } from '../../store/auth/selectors';

const API_URL_IMG = "http://localhost:5005/images";

function PostedHouses({publishedHouses, user, handleDeleteHouse}) {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [isAuthenticated,publishedHouses]);

  if (isLoading) {
    return <p>loading.....</p>;
  }

  return (
    <div className="house-cards">
      {/* Optional chaining (user?.published?.map) to safely access published only if user and user.published are defined. */}
      {publishedHouses.length > 0 ? (
        publishedHouses.map((house) => (
          <div className="card-container" key={house._id}>
            <div className="card-img">
            <button
                    className="btn-faHeart"
                    onClick={() =>handleDeleteHouse(house._id)}
                  >
                    <span>delete</span>
                  </button>
              <p className="card-img-text">
                {house.availability.forRent ? "For rent" : "For Sale"}
              </p>
              <img
                src={`${API_URL_IMG}/${house.images[0]}`}
                alt="House image"
                loading="lazy"
              />
            </div>

            <div className="card-body">
              <Link to={`/housesDetails/${house._id}`} className="house-cards-like">
                <h1>{house.address}</h1>
                <p>
                  <span>
                    $
                    {house.availability.forRent ? house.rentalPrice : house.price}
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
        <p>You have no posted house yet!</p>
      )}
    </div>
  );
}

export default PostedHouses;