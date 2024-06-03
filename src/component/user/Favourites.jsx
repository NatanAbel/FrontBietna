import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleFavorites } from '../../store/auth/slice';
import axios from 'axios';

const API_URL_IMG = "http://localhost:5005/images";
const API_URL = import.meta.env.VITE_BACK_URL;

function Favourites({user}) {
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const dispatch = useDispatch()

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
          // A condition to remove from favorites if it's already added or add to favorites if it doesn't.
          const updatedFavs = favorites.some((house) => house._id === houseId)
          ? favorites.filter((prev) => prev._id !== houseId)
          : [...favorites, res.data]

          setFavorites(updatedFavs);
          
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    useEffect(() => {
      if (user) {
        setFavorites(user.favorites || []);
          setIsLoading(false);
      }
  }, [user]);

  if (isLoading) {
    return <p>loading.....</p>;
  }

  return (
    <div className="house-cards">
      {/* Optional chaining (user?.favorites?.map) to safely access favorites only if user and user.favorites are defined. */}
      {favorites?.length > 0 ? (
        favorites.map((house) => (
          <div className="card-container" key={house._id}>
            <div className="card-img">
            <button
                    className="btn-faHeart"
                    onClick={() =>handleFavourites(house._id)}
                  >
                    {favorites.includes(house._id) ? "🤍":"🖤" }
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

export default Favourites