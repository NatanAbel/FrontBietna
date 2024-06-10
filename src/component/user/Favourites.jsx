import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorites } from '../../store/auth/slice';
import axios from 'axios';
import { selectIsAuthenticated } from '../../store/auth/selectors';

const API_URL_IMG = "http://localhost:5005/images";
const API_URL = import.meta.env.VITE_BACK_URL;

function Favourites({user,favourites,handleFavBtn}) {
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useSelector(selectIsAuthenticated)

    console.log("user.favorites......",user.favorites)

    useEffect(() => {
      if (isAuthenticated) {
          setIsLoading(false);
      }
  }, [isAuthenticated, favourites]);

  if (isLoading) {
    return <p>loading.....</p>;
  }

  return (
    <div className="house-cards">
      {/* Optional chaining (user?.favourites?.map) to safely access favourites only if user and user.favourites are defined. */}
      {favourites.length > 0 ? (
        favourites.map((house) => (
          <div className="card-container" key={house._id}>
            <div className="card-img">
            <button
                    className="btn-faHeart"
                    onClick={() =>handleFavBtn(house._id)}
                  >
                    {favourites.includes(house._id) ? "🤍":"🖤" }
                  </button>
              <p className="card-img-text">
                {house?.availability?.forRent ? "For rent" : "For Sale"}
              </p>
              {house.images && house.images.length > 0 && (
                                <img
                                    src={`${API_URL_IMG}/${house.images[0]}`}
                                    alt="House image"
                                    loading="lazy"
                                />
                            )}
            </div>

            <div className="card-body">
              <Link to={`/housesDetails/${house._id}`} className="house-cards-like">
                <h1>{house.address}</h1>
                <p>
                  <span>
                    $
                    {house?.availability?.forRent ? house.rentalPrice : house.price}
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
        <p>You have no favorite house yet!</p>
      )}
    </div>
  )
}

export default Favourites;