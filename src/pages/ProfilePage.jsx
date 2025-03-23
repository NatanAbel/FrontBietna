import DOMPurify from "dompurify";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectLoginToken, selectUser } from "../store/auth/selectors";
import AccountForm from "../components/user/AccountForm.jsx";
import axios from "axios";
import PostedHouses from "../components/user/PostedHouses.jsx";
import {
  houseDelete,
  logout,
  toggleFavorites,
  updateUser,
} from "../store/auth/slice";
import Favourites from "../components/user/Favourites.jsx";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import "../components/user/Account.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faGear,
  faStar,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFloppyDisk,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { Circles } from "react-loader-spinner";

const API_URL = import.meta.env.VITE_BACK_URL;
const PROFILE_IMG_DEFAULT_URL = import.meta.env.VITE_PROFILE_DEFAULT_URL;

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return `${date} ${time}`;
};

// Escape HTML for additional safety
const escapeHTML = (unsafe) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

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
  const [fullName, setFullName] = useState();
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploadImgPerc, setUploadImgPerc] = useState(0);
  const [file, setFile] = useState(null);
  const [prevProfileImg, setPrevProfileImg] = useState("");
  const [publishedHouses, setPublishedHouses] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [activeOption, setActiveOption] = useState("account");
  const [account, setAccount] = useState(false);
  const [posted, setPosted] = useState(false);
  const [favs, setfavs] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOptionsVisible, setIsOptionsVisible] = useState(true);
  const [warning, setWarning] = useState(false);
  const [cancelUploadImg, setCancelUploadImg] = useState(false);
  const [isEditProfilePic, setIsEditProfilePic] = useState(false);
  const [imgValidationError, setImgValidationError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector(selectLoginToken);
  const navigate = useNavigate();

  // Reference for the file input element
  const fileInputRef = useRef(null);

  // Sanitize function
  const sanitizeInput = (input) => DOMPurify.sanitize(input);

  const handleOptionClick = (option) => {
    setActiveOption(option);
    setAccount(option === "account");
    setPosted(option === "posted");
    setfavs(option === "favourites");
    setSaved(option === "saved");

    if (isMobile) {
      setIsOptionsVisible(!isOptionsVisible);
    }
    if (warning) {
      setWarning(false);
    }
  };

  const toggleOptionsVisibility = () => {
    setIsOptionsVisible(true);
  };

  

  const handleDeleteHouse = async (house_id) => {
    try {
      const res = await axios.delete(`${API_URL}/houses/${house_id}/delete`, {
        headers: {
          Authorization: "Bearer " + token,
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
      console.log("An error occurred while deleting");
    }
  };

  const handleFavBtn = async (houseId) => {
    if (!houseId) {
      console.error("Invalid houseId");
      return;
    }

    // Perform basic validation on the client
    if (!houseId.match(/^[a-fA-F0-9]{24}$/)) {
      console.error("Invalid houseId format");
      return;
    }

    const body = { favorites: houseId };

    try {
      const res = await axios.put(`${API_URL}/auth/update/profile`, body, {
        headers: {
          Authorization: "Bearer " + token,
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

  const userDeleteCheck = (del) => {
    if (del === "warning") {
      setWarning(true);
      setActiveOption("delete");
    } else if (del === "delete") {
      deleteUser();
      setWarning(false);
    } else if (del === "cancel") {
      setWarning(false);
    }
    return;
  };

  const validateFileSignature = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const bytes = new Uint8Array(reader.result);
        const signature = bytes.slice(0, 4).join(""); // Get first 4 bytes as signature

        // Check magic bytes for different image formats
        if (signature.slice(0, 4) === "2552") {
          // JPEG (FFD8)
          resolve(true);
        } else if (signature.slice(0, 4) === "1378") {
          // PNG (8950)
          resolve(true);
        } else if (signature.slice(0, 4) === "7172") {
          // GIF (4749)
          resolve(true);
        } else {
          reject("Invalid file signature");
        }
      };
      reader.onerror = () => {
        reject("Failed to read file for signature");
      };
      reader.readAsArrayBuffer(file); // Read file as binary
    });
  };

  // Validate files for type, size, and magic bytes (signature)
  // Function to validate a single file (type, size, signature)
  const validateFile = async (file) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    // Validate file type (MIME type)
    setImgValidationError("");
    if (!validTypes.includes(file.type)) {
      setImgValidationError(
        "Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed."
      );
      return { valid: false };
    }

    // Validate file size
    if (file.size > maxSize) {
      setImgValidationError("File size exceeds the 5MB limit.");
      return { valid: false };
    }

    // Validate file signature (magic bytes)
    try {
      await validateFileSignature(file);
    } catch (error) {
      setImgValidationError("Invalid file signature.");
      return { valid: false };
    }

    return { valid: true };
  };

  // Handle image file selection and preview
  const handleFileChange = async (e) => {
    e.preventDefault();
    try {
      const selectedFile = e.target.files[0]; // Convert the FileList to an array
      if (selectedFile) {
        // Function to sanitize the filename (removes unsafe characters)
        const sanitizeFilename = (filename) => {
          return filename
            .replace(/[^a-zA-Z0-9_-]/g, "_") // Only allow safe characters
            .slice(0, 100) // Limit filename length
            .replace(/\.\.+/, "_"); // Remove dangerous characters like ".."
        };

        // Sanitize filename
        const sanitizedFileName = sanitizeFilename(selectedFile.name);
        const sanitizedFile = new File([selectedFile], sanitizedFileName, {
          type: selectedFile.type,
        });
        // const sanitizedFiles = files.map((file) => {
        //   const sanitizedFileName = sanitizeFilename(file.name);
        //   return new File([file], sanitizedFileName, { type: file.type });
        // });

        const fileValidation = await validateFile(selectedFile);

        if (fileValidation.valid) {
          // If file is valid, generate a URL for preview
          const previewUrl = URL.createObjectURL(sanitizedFile);

          // Update preview images and file state
          setProfilePhoto(previewUrl);
          setFile(sanitizedFile);
        }
      }
    } catch (e) {
      console.error("Error during file upload:", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!file) return; // If no file is selected, exit early

    // Check if profilePhoto is the default image URL and return early if so
    if (profilePhoto === PROFILE_IMG_DEFAULT_URL) return;

    const formData = new FormData();
    // const formData = new FormData();
    formData.append("profileImage", file); // Append the selected file to FormData
    try {
      const res = await axios.put(
        `${API_URL}/auth/profile-picture/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadImgPerc(percentage); // Update upload percentage
              // alert("Profile picture uploaded successfully");
            }
          },
        }
      );
      if (res.status === 200) {
        setFile(null);
        setProfilePhoto(""); // Reset profile photo preview
        setPrevProfileImg(res.data.profilePicture);
        setIsEditProfilePic(false);
        setCancelUploadImg(true);
        setUploadImgPerc(0);
        dispatch(updateUser(res.data));
      }
    } catch (e) {
      console.error(e);
      if (e.response && e.response.status === 429) {
        setImgValidationError(
          "Too many update request, please try again later."
        );
        return;
      }
    }
  };

  const removeProfilePic = async () => {
    if (prevProfileImg !== PROFILE_IMG_DEFAULT_URL) {
      const body = { profilePicture: PROFILE_IMG_DEFAULT_URL };
      const res = await axios.put(
        `${API_URL}/auth/profile-picture/update`,
        body,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      if (res.status === 200) {
        setPrevProfileImg(res.data.profilePicture);
        setCancelUploadImg(true);
        setIsEditProfilePic(false);
        dispatch(updateUser(res.data));
      }
    }
  };

  const handleCancel = () => {
    setFile(null); // Clear the selected file
    setProfilePhoto(""); // Clear the image preview
    setUploadImgPerc(0); // Reset the upload progress
    setIsEditProfilePic(false);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the input value
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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
        setPrevProfileImg(user.profilePicture);
        setPublishedHouses(user.published);
        setSavedSearches(user.savedSearches);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    // Set time to display text for image upload successfully.
    setInterval(() => {
      if (cancelUploadImg) {
        setCancelUploadImg(false);
        // setImgValidationError("")
      }
    }, 3000);
  }, [imgValidationError, cancelUploadImg]);

  // Clean up the previous object URL when the component unmounts or when profilePhoto changes
  useEffect(() => {
    // Revoke the previous URL if it's available
    if (profilePhoto) {
      return () => {
        URL.revokeObjectURL(profilePhoto); // Cleanup when component unmounts or profilePhoto changes
      };
    }
  }, [profilePhoto]);

  useEffect(() => {
    if (!posted && !favs) {
      setAccount(true);
      setActiveOption("account");
    }

    if (isMobile) {
      setAccount(false);
      setPosted(false);
      setfavs(false);
      setSaved(false);
    } else {
      setIsOptionsVisible(true);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    fetchProfile();
    setIsLoading(false);
  }, []);

  // // Toggle modal visibility
  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  // // Display profile image modal using React Portal
  // const displayProfileImage = () => {
  //   return ReactDOM.createPortal(
  //     // <div className="profile-modal" >
  //       <div className="modal-content">

  //         <div >
  //           <img src={prevProfileImg} alt="profile-pic-modal" className="modal-profile-pic" />
  //         </div>
  //       </div>
  //     ,
  //     document.getElementById("profile-modal")
  //   );
  // };

  return (
    <>
      {isLoading ? (
        <div style={{ margin: "0 auto" }}>
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
      ) : (
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-picture">
              {/* {isModalOpen && <div className="profile-modal" >
          {displayProfileImage()}
          </div>} */}

              <div className="img-container">
                <img
                  src={file && profilePhoto ? profilePhoto : prevProfileImg}
                  alt={sanitizeInput("Profile Picture")}
                  className={`profile-img ${
                    file && profilePhoto ? "profile-img-opacity" : ""
                  }`}
                  // onClick={toggleModal}
                />
              </div>
              <p className="edit-img-icon">
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={() => setIsEditProfilePic(true)}
                />
              </p>

              <form onSubmit={handleSubmit}>
                {isEditProfilePic && (
                  <div className="upload-btn-container">
                    <div>
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        onClick={handleCancel}
                        className="edit-close-btn"
                      />
                    </div>
                    {imgValidationError ? (
                      <div className="image-validation">
                        <p>{escapeHTML(imgValidationError)}</p>
                      </div>
                    ) : (
                      <div className="file-status">
                        {" "}
                        {profilePhoto && file && (
                          <p>Image selected to upload...!</p>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "1rem",
                        paddingTop: ".5rem",
                      }}
                    >
                      {file && !imgValidationError ? (
                        <button className="img-upload-btn" type="submit">
                          Upload
                        </button>
                      ) : (
                        <label className="img-upload-btn">
                          Add photo
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="profileImage/*"
                            name="profileImage"
                            onChange={handleFileChange}
                            className="file-input"
                            style={{ display: "none" }}
                          />
                        </label>
                      )}
                      <button
                        className="img-delete-btn"
                        type="button"
                        onClick={removeProfilePic}
                      >
                        <FontAwesomeIcon className="" icon={faTrash} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="profile-username">
            <p className="text-username">
              <span>{sanitizeInput(`${userFirstName} ${userLastName}`)}</span>
            </p>{" "}
            <div className="file-status-success">
              {cancelUploadImg && (
                <p className="success-upload-img">
                  Image upload successfully..✅
                </p>
              )}
            </div>
            <p className="text-username">{/* <span>{username}</span> */}</p>
          </div>

          <div className="profile-details-wrapper">
            <div className="profile-info">
              <div
                className={`profile-options ${
                  isOptionsVisible ? "" : "hidden"
                }`}
              >
                <p
                  onClick={() => handleOptionClick("account")}
                  className={activeOption === "account" ? "active" : ""}
                >
                  <FontAwesomeIcon className="profile-icon" icon={faGear} />{" "}
                  Account Setting
                </p>

                <p
                  onClick={() => handleOptionClick("posted")}
                  className={activeOption === "posted" ? "active" : ""}
                >
                  <FontAwesomeIcon className="profile-icon" icon={faUpload} />{" "}
                  Posted
                </p>

                <p
                  onClick={() => handleOptionClick("favourites")}
                  className={activeOption === "favourites" ? "active" : ""}
                >
                  <FontAwesomeIcon className="profile-icon" icon={faStar} />{" "}
                  Favourites
                </p>

                {/* <p
              onClick={() => handleOptionClick("saved")}
              className={activeOption === "saved" ? "active" : ""}
            >
              <FontAwesomeIcon className="profile-icon" icon={faFloppyDisk} />{" "}
              Saved Searches
            </p> */}

                <p
                  className={`delete-user ${
                    activeOption === "delete" ? "active" : ""
                  }`}
                  onClick={() => userDeleteCheck("warning")}
                >
                  <FontAwesomeIcon className="profile-icon" icon={faTrash} />{" "}
                  Delete Account
                </p>
                {/* <p onClick={deleteUser}>Delete Account</p> */}
              </div>
              <div className="options-text">
                {!isOptionsVisible && (
                  <h3>
                    {activeOption.charAt(0).toUpperCase() +
                      activeOption.slice(1)}
                  </h3>
                )}
              </div>
              <div
                className={
                  !isMobile
                    ? "profile-to-display"
                    : `mobile-profile-options ${
                        isOptionsVisible ? "hide-mobile" : ""
                      } `
                }
              >
                {/* Close Button on Mobile */}
                {isMobile && !isOptionsVisible && (
                  <button
                    className="close-button"
                    onClick={toggleOptionsVisibility}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </button>
                )}

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
            <div className={`delete-warning ${warning ? "" : "warning-hide"}`}>
              <p>Are you sure you want to delete your account??</p>
              <div className="button-delete-container">
                <button
                  className="button-delete danger"
                  onClick={() => userDeleteCheck("delete")}
                >
                  Delete
                </button>
                <button
                  className="button-delete"
                  onClick={() => userDeleteCheck("cancel")}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ProfilePage;
