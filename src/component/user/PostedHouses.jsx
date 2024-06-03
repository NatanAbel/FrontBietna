import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL_IMG = "http://localhost:5005/images";

function PostedHouses({ user }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <p>loading.....</p>;
  }

  return (
    <div className="house-cards">
      {/* Optional chaining (user?.published?.map) to safely access published only if user and user.published are defined. */}
      {user?.published?.length > 0 ? (
        user.published.map((house) => (
          <div className="card-container" key={house._id}>
            <div className="card-img">
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
        <p>You have no published house yet!</p>
      )}
    </div>
  );
}

export default PostedHouses;