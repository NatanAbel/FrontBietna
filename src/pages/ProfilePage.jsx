import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/auth/selectors";
import AccountForm from "../component/user/AccountForm";
import axios from "axios";
import PostedHouses from "../component/user/postedHouses";
import { toggleFavorites } from "../store/auth/slice";
import Favourites from "../component/user/Favourites";

const API_URL = import.meta.env.VITE_BACK_URL;

function ProfilePage() {
  // const currentUser = useSelector(selectUser);
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [username, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [telNumber, setTelNumber] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [account, setAccount] = useState(true);
  const [posted, setPosted] = useState(true);
  const [favs, setfavs] = useState(true);
  const [saved, setSaved] = useState(false);

  // const handleAccount = (username, email, firstName, lastName, telNumber) => {
  //   setUserName(username);
  //   setEmailUser(email);
  //   setUserFirstName(firstName);
  //   setUserLastName(lastName);
  //   setTelNumber(telNumber);
  // };

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
          setFavorites(user.favorites);
          setUserFirstName(user.firstName);
          setUserLastName(user.lastName);
          setTelNumber(user.phoneNumber);
          setProfilePhoto(user.profilePicture);
          setPublishedPosts(user.published);
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
          <img src={profilePhoto ? profilePhoto : null} alt="user Image" />
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
            <p>Account</p>
            <p>posted</p>
            <p>favourites</p>
            <p>searchSaved</p>
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
            {posted && <PostedHouses user={user} />}
            {favs && <Favourites user={user} />}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
