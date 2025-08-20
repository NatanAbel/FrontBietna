import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectLoginToken,
  selectMessage,
  selectUser,
} from "../../store/auth/selectors";
import "./HouseForm.css";
import { messageResponse } from "../../store/auth/slice";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";
import { loginAxios } from "../../utils/interceptorApi";

const API_URL = import.meta.env.VITE_BACK_URL;

function HouseForm(props) {
  const {
    heading,
    isUpdating = false,
    houseId,
    houseAddress,
    housePrice,
    houseBedrooms,
    houseBathrooms,
    houseSqm,
    houseRentalPrice,
    houseDescription,
    houseFeatures,
    houseImages,
    houseAvailability,
    houseYearBuilt,
    houseCountry,
    homeType,
    homeCity,
  } = props;

  const user = useSelector(selectUser);
  const token = useSelector(selectLoginToken);
  const message = useSelector(selectMessage);
  const dispatch = useDispatch();
  const [address, setAddress] = useState(houseAddress || "");
  const [price, setPrice] = useState(housePrice || 0);
  const [bedrooms, setBedrooms] = useState(houseBedrooms || 0);
  const [bathrooms, setBathrooms] = useState(houseBathrooms || 0);
  const [sqm, setSqm] = useState(houseSqm || 0);
  const [rentalPrice, setRentalPrice] = useState(houseRentalPrice || 0);
  const [description, setDescription] = useState(houseDescription || "");
  const [images, setImages] = useState(houseImages || []);
  const [previewImages, setPreviewImages] = useState([]);
  const [fileImage, setFileImage] = useState([]);
  const [availability, setAvailability] = useState(
    houseAvailability || { forRent: true, forSale: false }
  );
  const [features, setFeatures] = useState(houseFeatures);
  const [houseType, setHouseType] = useState(homeType);
  const [enumValuesFeature, setEnumValuesFeature] = useState(
    isUpdating ? houseFeatures : []
  );
  const [enumValuesType, setEnumValuesType] = useState(
    isUpdating ? homeType : ""
  );
  const [yearBuilt, setYearBuilt] = useState(houseYearBuilt || 0);
  const [city, setCity] = useState(homeCity || "");
  const [country, setCountry] = useState(houseCountry || "");
  const [showDropdown, setShowDropdown] = useState(false);
  const [featureShowDropdown, setFeatureShowDropdown] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imgValidationError, setImgValidationError] = useState("");
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const navigate = useNavigate();
  const featureDropdownRef = useRef(null);
  const houseTypeDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Utility: Escape HTML to prevent XSS attacks
  const escapeHTML = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Check the magic bytes of each file and resolves if the file is valid or rejects if invalid
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
      reader.readAsArrayBuffer(file); // Read file as binary
    });
  };

  const validateFiles = async (files) => {
    if (!files || files.length === 0) return { valid: false };

    const validType = ["image/jpeg", "image/png", "image/gif"];

    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      // Reset the error message if file validation passes
      setImgValidationError("");
      setNotification("");
      setNotificationType("");
      if (!validType.includes(file.type)) {
        setNotification("");
        setNotificationType("");
        setImgValidationError(
          "Invalid file type. Only JPG, PNG, and GIF are allowed."
        );
        return { valid: false };
      }

      if (file.size > maxSize) {
        setNotification("");
        setNotificationType("");
        setImgValidationError("File size exceeds the 5MB limit.");
        return { valid: false };
      }
      // Check file signature (magic bytes)
      try {
        await validateFileSignature(file); // Validate magic bytes
      } catch (error) {
        setNotification("");
        setNotificationType("");
        setImgValidationError("Invalid file signature.");
        return { valid: false };
      }
    }
    // setImgValidationError("")
    return { valid: true };
  };

  const handleFileChange = async (e) => {
    e.preventDefault();

    try {
      // Get the selected files from the input element
      const selectedFiles = e.target.files;
      const files = Array.from(selectedFiles);
      // Check if the total image count exceeds 10
      if (images.length + files.length > 10) {
        setNotification("");
        setNotificationType("");
        setImgValidationError(
          `Maximum of 10 images allowed. You currently have ${
            images.length
          } images.You are trying to upload ${
            images.length + files.length
          } files.`
        );
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const sanitizeFilename = (filename) => {
        // Sanitize and remove any unsafe characters (allowing only letters, digits, and - _)
        return filename
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .slice(0, 100) // Limit filename length
          .replace(/\.\.+/, "_"); // Avoid dangerous characters like "..";
      };

      const sanitizedFiles = files.map((file) => {
        const sanitizedFileName = sanitizeFilename(file.name);
        return new File([file], sanitizedFileName, { type: file.type });
      });

      const fileValidated = await validateFiles(selectedFiles);

      if (fileValidated.valid) {
        if (isUpdating) {
          // Generate a temporary URL for a file object (such as an image file) that is stored in the browser’s memory.
          const urls = sanitizedFiles.map((file) => {
            // Ensure the file is passed to createObjectURL
            return URL.createObjectURL(file);
          });

          const maxImageNumber =
            previewImages.length + urls.length + images.length;

          if (maxImageNumber > 10) {
            setNotification("");
            setNotificationType("");
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
            setPreviewImages([]);
            setFileImage([]);
            setImgValidationError(
              `Maximum of 10 images allowed. You currently have ${images.length} images and you trying are to uploaded ${maxImageNumber} files.`
            );
            return;
          } else {
            setPreviewImages((prevImages) => [...prevImages, ...urls]);
            // Update the preview and image state
            // const updatedImages = Array.from(files)
            setFileImage((prevFiles) => [...prevFiles, ...sanitizedFiles]);
          }
        } else {
          // If it's a new house, simply update the state with the new images
          setImages(sanitizedFiles);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Function to format numbers with commas
  const formatNumberWithCommas = (number) => {
    return number.toLocaleString();
  };

  // Remove commas before updating the state
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/,/g, ""); // Remove commas
    setPrice(parseInt(value || 0));
  };

  const handleRentalPriceChange = (e) => {
    const value = e.target.value.replace(/,/g, ""); // Remove commas
    setRentalPrice(parseInt(value || 0));
  };

  // Modified getLocation function to return the latitude and longitude directly
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        const userConsent = window.confirm("Would you like to share your location for this property?");
  
        if (userConsent) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            (error) => {
              if (error.code === 1) {
                alert("Permission denied. Please allow location access.");
              } else if (error.code === 2) {
                alert("Position unavailable. Please check your location settings.");
              } else if (error.code === 3) {
                alert("Location request timed out. Try again.");
              } else {
                alert("An unknown error occurred while retrieving your location.");
              }
              reject(error);
            }
          );
        } else {
          alert("You chose not to share your location.");
          reject(new Error("Location sharing declined by user"));
        }
      } else {
        alert("Geolocation is not supported by your browser.");
        reject(new Error("Geolocation not supported"));
      }
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    let lat = latitude;
    let lng = longitude;

    const formData = new FormData();
    // Ask the user if they want to use their current location
  const userWantsLocation = window.confirm("Do you want to include your current location with this property?");

    // Only get the location if it's not an update 
    if (!isUpdating && userWantsLocation) {
      try {
        const location = await getLocation();
        lat = location.latitude;
        lng = location.longitude;
  
        // Only add location if the user consents to share it
        if (lat && lng) {
          formData.append("latitude", lat);
          formData.append("longitude", lng);
        } else {
          alert("Location not available. Please enable location services.");
          return; // Stop form submission if location isn't available
        }
      } catch (error) {
        console.error("Error fetching location during form submit", error);
        return; // Stop form submission if there's an error with location
      }
    } else if (!userWantsLocation) {
      alert("Location sharing is disabled. Proceeding without location.");
      // Don't include latitude or longitude if they don't want to share location
    }

    // Sanitize all other fields
    const sanitizedFields = {
      description: DOMPurify.sanitize(description),
      address: DOMPurify.sanitize(address),
      price: DOMPurify.sanitize(price),
      city: DOMPurify.sanitize(city),
      country: DOMPurify.sanitize(country),
      yearBuilt: DOMPurify.sanitize(yearBuilt),
      homeType: DOMPurify.sanitize(enumValuesType),
      rentalPrice: DOMPurify.sanitize(rentalPrice),
      features: DOMPurify.sanitize(JSON.stringify(enumValuesFeature)),
      availability: DOMPurify.sanitize(JSON.stringify(availability)),
      bedrooms: DOMPurify.sanitize(bedrooms),
      bathrooms: DOMPurify.sanitize(bathrooms),
      sqm: DOMPurify.sanitize(sqm),
    };

    Object.entries(sanitizedFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Handle files for updating
    if (isUpdating) {
      // If you are updating, ensure files from fileImage are used
      const filesToUpload = [...fileImage]; // Use fileImage state
      filesToUpload.forEach((file) => {
        formData.append("image", file);
      });
    } else {
      // For new house, use images array
      if (images.length < 6) {
        setNotification("");
        setNotificationType("");
        setImgValidationError("Atlist 6 images are required!");
        return;
      }
      images.forEach((file) => {
        formData.append("image", file);
      });
    }

    try {
      const response = isUpdating
        ? await loginAxios.put(`/houses/${houseId}/update`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          })
        : await loginAxios.post(`/houses/new`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

      const houseData = response.data;

      if (response.status === 201 || response.status === 200) {
        setPreviewImages([]);
        setFileImage([]);
        setNotification("");
        setNotificationType("");
        navigate(`/housesDetails/${houseData._id}`);
      }
    } catch (e) {
      console.log(e);
      if (e.response && e.response.status === 429) {
        setNotification("");
        setNotificationType("");
        setImgValidationError(
          "Too many update requests, please try again later."
        );
        return;
      }
      const message = e?.response?.data?.message;
      setPreviewImages([]);
      setFileImage([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input value
      }
      dispatch(messageResponse(message));
    }
  };

  const handleAvailabilityChange = (forRent) => {
    // Reset rentalPrice to zero if switching from rent to sale
    if (availability.forRent && !forRent) {
      setRentalPrice(0);
    }
    // Reset price to zero if switching from sale to rent
    if (availability.forSale && forRent) {
      setPrice(0);
    }
    // Update the availability state
    setAvailability({ forRent, forSale: !forRent });
  };

  // hundeling house type dropdown
  const hundleHouseType = (clickedType) => {
    // Check if the clicked feature is already in the features array
    const isTypeSelected = houseType.filter((type) =>
      type.includes(clickedType.toLowerCase())
    );
    // If the feature is already selected, remove it from the features array
    if (isTypeSelected) {
      setEnumValuesType(clickedType);
    }
    setShowDropdown(false);
  };

  // hundeling features dropdown
  const hundelFeature = (clickedFeature) => {
    // Check if the clicked feature is already in the enumValuesFeature array
    const isFeatureSelected = enumValuesFeature.includes(clickedFeature);

    if (!isFeatureSelected) {
      // If the feature is not selected, add it to the enumValuesFeature array
      setEnumValuesFeature([...enumValuesFeature, clickedFeature]);
    } else {
      // If the feature is already selected, remove it from the enumValuesFeature array
      setEnumValuesFeature(
        enumValuesFeature.filter((feature) => feature !== clickedFeature)
      );
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setShowDropdown((prev) => !prev);
    setFeatureShowDropdown(false);
  };

  const toggleFeatureDropdown = (e) => {
    e.preventDefault();
    setFeatureShowDropdown(!featureShowDropdown);
    setShowDropdown(false);
  };

  // Fetch enum values for home types from the backend
  const houseEnumValues = async () => {
    try {
      const res = await axios.get(`${API_URL}/houses/homeTypes/enumValues`);
      setHouseType(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch enum values for features from the backend
  const featureEnumValues = async () => {
    try {
      const res = await axios.get(`${API_URL}/houses/enumValues/features`);
      setFeatures(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const response = await loginAxios.delete(
        `/houses/${houseId}/image`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { imageUrl },
        }
      );

      if (response.status === 200) {
        setImages((prevImages) => prevImages.filter((url) => url !== imageUrl));
        setImgValidationError("");
        setNotification(
          `Image "${escapeHTML(
            imageUrl.split("/").pop()
          )}" deleted successfully.`
        );
        setNotificationType("success");
      }
    } catch (error) {
      setImgValidationError("");
      setNotification("Error deleting the image. Please try again.");
      setNotificationType("error");
      console.error("Error deleting image:", error);
    }
  };

  useEffect(() => {
    houseEnumValues();
    featureEnumValues();
  }, [enumValuesFeature, enumValuesType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the House Type dropdown if clicked outside
      if (
        houseTypeDropdownRef.current &&
        !houseTypeDropdownRef.current.contains(event.target) &&
        !event.target.closest(".inputwrapper-dropdown-display")
      ) {
        setShowDropdown(false);
      }

      // Close the Feature dropdown if clicked outside
      if (
        featureDropdownRef.current &&
        !featureDropdownRef.current.contains(event.target) &&
        !event.target.closest(".inputwrapper-dropdown-display")
      ) {
        setFeatureShowDropdown(false);
      }
    };

    if (showDropdown || featureShowDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, featureShowDropdown]);

  useEffect(() => {
    // Cleanup function to revoke URLs when component unmounts or imageUrls change
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);


  const cancelUploadImg = (index) => {
    const removedFileName = fileImage[index]?.name || "Unknown";

    setFileImage((prevFiles) => prevFiles.filter((_, idx) => idx !== index)); // Remove the file from fileImage array
    setPreviewImages((prevImages) =>
      prevImages.filter((_, idx) => idx !== index)
    ); // Remove the preview image from previewImages array

    // Update the fileInputRef by filtering out the deleted image
    const updatedFileList = Array.from(fileInputRef.current.files).filter(
      (_, idx) => idx !== index
    );

    // Create a new DataTransfer object (used to manipulate file input)
    const dataTransfer = new DataTransfer();

    // Add the remaining files to the new DataTransfer object
    updatedFileList.forEach((file) => {
      dataTransfer.items.add(file);
    });

    // Update the file input with the new files
    fileInputRef.current.files = dataTransfer.files;

    // Update notification
    setImgValidationError("");
    setNotification(
      `Image "${escapeHTML(removedFileName)}" removed successfully.`
    );
    setNotificationType("success");
  };

  const upperEnumFeature = enumValuesFeature.map(
    (feature) => feature.charAt(0).toUpperCase() + feature.slice(1)
  );

  return (
    // <div className="house-form">
    <div className="form-container">
      <div className="house-form-heading">
        <h1>{heading}</h1>
      </div>
      <form onSubmit={handleSubmit} className="form-wrapper">
        <div className="inputwrapper full-width-inputwarapper">
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Address"
          />
        </div>
        <div className="inputwrapper">
          <label>Availability:</label>
          <div className="inputwrapper-radio">
            <div className="radio-wrapper">
              <input
                type="radio"
                id="rent"
                value="forRent"
                name="availability"
                checked={availability.forRent}
                onChange={() => handleAvailabilityChange(true)}
              />
              <label htmlFor="rent" className="text-radio">
                Rent
              </label>
            </div>
            <div className="radio-wrapper">
              <input
                type="radio"
                id="sale"
                value="forSale"
                name="availability"
                checked={availability.forSale}
                onChange={() => handleAvailabilityChange(false)}
              />
              <label htmlFor="sale" className="text-radio">
                Sale
              </label>
            </div>
          </div>
        </div>
        <div className="inputwrapper">
          <label>Bedrooms:</label>
          <input
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(parseInt(e.target.value))}
            required
            placeholder="Bedrooms"
          />
        </div>
        <div className="inputwrapper">
          <label>Bathrooms:</label>
          <input
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(parseInt(e.target.value))}
            required
            placeholder="Bathrooms"
          />
        </div>
        <div className="inputwrapper">
          <label>Sqm:</label>
          <input
            type="number"
            value={sqm}
            onChange={(e) => setSqm(parseInt(e.target.value))}
            required
            placeholder="Sqm"
          />
        </div>
        {availability.forSale ? (
          <div className="inputwrapper">
            <label>Price:</label>
            <input
              type="text"
              value={formatNumberWithCommas(price)}
              onChange={handlePriceChange}
              required
              placeholder="Price"
            />
          </div>
        ) : (
          <div className="inputwrapper">
            <label>RentalPrice:</label>
            <input
              type="text"
              value={formatNumberWithCommas(rentalPrice)}
              onChange={handleRentalPriceChange}
              required
              placeholder="RentalPrice"
            />
          </div>
        )}
        <div className="inputwrapper">
          <label>Year-Built:</label>
          <input
            type="number"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(parseInt(e.target.value))}
            required
            placeholder="Year-Built"
          />
        </div>

        <div className="inputwrapper">
          <label>Country:</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={isUpdating}
            placeholder="Country"
          />
        </div>

        <div className="inputwrapper" ref={houseTypeDropdownRef}>
          <label>House Type:</label>
          <div className="house-type-value">
            <p className="input-house-type">
              {enumValuesType.charAt(0).toUpperCase() + enumValuesType.slice(1)}
            </p>
          </div>
          <button className="house-Type-btn" onClick={toggleDropdown}>
            {showDropdown ? "🔼" : "🔽"}
          </button>
          <div className="inputwrapper-dropdown-display">
            {showDropdown &&
              houseType.map((homeType) => {
                return (
                  <div key={homeType} className="dropdown-content">
                    {/* <label htmlFor="">df</label> */}
                    <p
                      onClick={() => hundleHouseType(homeType)}
                      value={homeType}
                      className="content-list"
                    >
                      {homeType.charAt(0).toUpperCase() + homeType.slice(1)}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="inputwrapper">
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>

        <div
          className="inputwrapper full-width-inputwarapper"
          ref={featureDropdownRef}
        >
          <label>Features:</label>
          <div className="inputwrapper-dropdown-display">
            {features &&
              features.map((feature, index) => {
                return (
                  <div key={feature} className="checkbox-content">
                    <input
                      type="checkbox"
                      id={feature}
                      name={feature}
                      value={feature}
                      checked={enumValuesFeature.includes(feature)}
                      onChange={() => hundelFeature(feature)}
                    />
                    <label htmlFor={feature}>
                      {" "}
                      {feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="inputwrapper full-width-inputwarapper">
          <label htmlFor="description">Description</label>
          <textarea
            rows={description.length > 113 ? "10" : ""}
            cols={description.length > 113 ? "50" : ""}
            className="form-control"
            id="description"
            placeholder="Enter a detailed description of your house!"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          ></textarea>
        </div>
        <div className="inputwrapper full-width-inputwarapper">
          <div>
            <label>Images:</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              name="image"
              style={{ width: "100%" }}
            />
          </div>
          <div>
            {isUpdating && (
              <div className="uploaded-img">
                {images.map((image, i) => (
                  <div key={`image-${i}`}  className="delete-img-container">
                    <img src={image} alt="uploaded img" />
                    <p style={{ display: "none" }}>
                      {escapeHTML(image.split("/").pop())}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                      className="delete-image-button"
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                  </div>
                ))}
                {previewImages.length > 0 &&
                  previewImages.map((img, index) => (
                    <div className="delete-img-container">
                      <img src={img} alt="uploaded-img" />
                      <p style={{ display: "none" }}>
                        {escapeHTML(fileImage[index]?.name || "Unknown")}
                      </p>
                      <button
                        type="button"
                        onClick={() => cancelUploadImg(index)}
                        className="delete-image-button"
                      >
                        <FontAwesomeIcon icon={faCircleXmark} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
            {imgValidationError && (
              <p style={{ color: "red" }}>{escapeHTML(imgValidationError)}</p>
            )}
            {message && <p style={{ color: "red" }}>{message}</p>}
            {notification && (
              <div
                className={`notification ${notificationType}`} // Use className to style based on type
                style={{
                  color: notificationType === "success" ? "green" : "red",
                  marginTop: "10px",
                  maxWidth: "400px",
                  overflowX: "scroll",
                }}
              >
                <p>{notification}</p>
              </div>
            )}
          </div>
        </div>
        <div className="button-house-form full-width-inputwarapper">
          <button type="submit">
            {isUpdating ? <p>Update</p> : <p>Create</p>}
          </button>
        </div>
      </form>
    </div>
    // </div>
  );
}

export default HouseForm;
