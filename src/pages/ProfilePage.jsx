import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginToken, selectUser } from "../store/auth/selectors";
import AccountForm from "../component/user/AccountForm";
import axios from "axios";
import PostedHouses from "../component/user/postedHouses";
import { houseDelete, logout, toggleFavorites } from "../store/auth/slice";
import Favourites from "../component/user/Favourites";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_BACK_URL;

function ProfilePage() {
  // const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [username, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [telNumber, setTelNumber] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [publishedHouses, setPublishedHouses] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [account, setAccount] = useState(false);
  const [posted, setPosted] = useState(false);
  const [favs, setfavs] = useState(false);
  const [saved, setSaved] = useState(false);

  const token = useSelector(selectLoginToken);
  const navigate = useNavigate();

  const handleAccountFrom = () => {
    setAccount(true);
    setPosted(false);
    setfavs(false);
    setSavedSearches(false);
  };

  const handlePostedHouse = () => {
    setAccount(false);
    setPosted(true);
    setfavs(false);
    setSavedSearches(false);
  };

  const handleFavourites = () => {
    setAccount(false);
    setPosted(false);
    setfavs(true);
    setSavedSearches(false);
  };

  const handleDeleteHouse = async (house_id) => {
    try {
      const res = await axios.delete(`${API_URL}/houses/${house_id}/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204) {
        // Update the state to remove the deleted house
        setPublishedHouses((prevPublishedHouses) =>
          prevPublishedHouses.filter((house) => house._id !== house_id)
        );

        // Update the state to remove the deleted house from favourites
        setFavourites((prevFavourites) =>
          prevFavourites.filter((house) => house._id !== house_id)
        );

        // Dispatch houseDelete action
        dispatch(houseDelete(house_id));

        // Check if the house is in favourites before dispatching toggleFavorites
        const isFavourite = favourites.some((house) => house._id === house_id);

        if (isFavourite) {
          dispatch(toggleFavorites(house_id));
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleFavBtn = async (houseId) => {
    const token = localStorage.getItem("token");

    const body = { favourites: houseId };

    try {
      const res = await axios.put(`${API_URL}/auth/profile`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        // A condition to remove from favourites if it's already added or add to favourites if it doesn't.
        const updatedFavs = favourites.some((house) => house._id === houseId)
          ? favourites.filter((prev) => prev._id !== houseId)
          : [...favourites, res.data];

        setFavourites(updatedFavs);

        dispatch(toggleFavorites(houseId));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const deleteUser = async () => {
    try {
      const res = await axios.delete(`${API_URL}/auth/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    if (!posted && !favs) {
      setAccount(true);
    }
  }, [account]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          const user = res.data.user;
          setUser(user);
          setUserName(user.userName);
          setUserEmail(user.email);
          setEditBio(user.bio);
          setFavourites(user.favorites);
          setUserFirstName(user.firstName);
          setUserLastName(user.lastName);
          setTelNumber(user.phoneNumber);
          setProfilePhoto(user.profilePicture);
          setPublishedHouses(user.published);
          setSavedSearches(user.savedSearches);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-picture">
          <img src={profilePhoto ? profilePhoto : null} alt="user photo" />
          <button>change photo</button>
        </div>
        <div className="profile-username">
          <p>
            <span>{username}</span>
          </p>
          <button>bio</button>
        </div>
      </div>
      <div className="profile-details-wrapper">
        <div className="profile-info">
          <div className="profile-options">
            <p onClick={handleAccountFrom}>Account</p>
            <p onClick={handlePostedHouse}>Posted</p>
            <p onClick={handleFavourites}>Favourites</p>
            <p>searchSaved</p>
            <p onClick={deleteUser}>Delete Account</p>
            {/* <p onClick={deleteUser}>Delete Account</p> */}
          </div>
          <div className="profile-to-display">
            {account && (
              <AccountForm
                username={username}
                setUserName={setUserName}
                emailUser={userEmail}
                setUserEmail={setUserEmail}
                userFirstName={userFirstName}
                setUserFirstName={setUserFirstName}
                userLastName={userLastName}
                setUserLastName={setUserLastName}
                telNumber={telNumber}
                setTelNumber={setTelNumber}
              />
            )}
            {posted && (
              <PostedHouses
                publishedHouses={publishedHouses}
                user={user}
                handleDeleteHouse={handleDeleteHouse}
              />
            )}
            {favs && (
              <Favourites
                user={user}
                favourites={favourites}
                handleFavBtn={handleFavBtn}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
