import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../store/auth/selectors";

const API_URL = "http://localhost:5005";

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
    homeType,
    homeCity,
  } = props;

  const user = useSelector(selectUser)

  const [address, setAddress] = useState(houseAddress || "");
  const [price, setPrice] = useState(housePrice || 0);
  const [bedrooms, setBedrooms] = useState(houseBedrooms || 0);
  const [bathrooms, setBathrooms] = useState(houseBathrooms || 0);
  const [sqm, setSqm] = useState(houseSqm || 0);
  const [rentalPrice, setRentalPrice] = useState(houseRentalPrice || 0);
  const [description, setDescription] = useState(houseDescription || "");
  const [images, setImages] = useState(houseImages || []);
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
  const [showDropdown, setShowDropdown] = useState(false);
  const [featureShowDropdown, setFeatureShowDropdown] = useState(false);
  const [isBoxchecked, setIsBoxChecked] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    e.preventDefault();
    try {
      // Get the selected files from the input element
      const selectedFiles = e.target.files;
      if (isUpdating) {
        // Convert the FileList to an array and update the state
        const updatedImages = Array.from(selectedFiles);
        setImages([...images, ...updatedImages]);
      } else {
        // If it's a new house, simply update the state with the new images
        setImages(Array.from(selectedFiles));
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const hundelSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token")
    try {
      // Create a FormData object
      const formData = new FormData();
      // Append images to the FormData
      images.forEach((image) => {
        formData.append(`image`, image);
      });
      // Append other fields to the FormData
      formData.append("address", address);
      formData.append("price", price);
      formData.append("bedrooms", bedrooms);
      formData.append("bathrooms", bathrooms);
      formData.append("sqm", sqm);
      formData.append("rentalPrice", rentalPrice);
      formData.append("description", description);
      formData.append("features", JSON.stringify(enumValuesFeature));
      formData.append("yearBuilt", yearBuilt);
      formData.append("homeType", enumValuesType);
      formData.append("city", city);
      formData.append("availability", JSON.stringify(availability));

      console.log("formData.................", formData);

      const response = isUpdating
        ? await axios.put(`${API_URL}/houses/${houseId}/update`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            }, // Set the content type to handle file uploads
          })
        : await axios.post(`${API_URL}/houses/new`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
              // Set the content type to handle file uploads
          });

      const houseData = response.data;
      console.log(houseData);
      if (response.status === 201 || response.status === 200) {
        navigate(`/housesDetails/${houseData._id}`);
      }
    } catch (e) {
      console.log(e.message);
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
    setShowDropdown(!showDropdown);
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

  useEffect(() => {
    houseEnumValues();
    featureEnumValues();
  }, [enumValuesFeature,enumValuesType]);

  // useEffect(() => {
  //   console.log("enumValuesFeature......", enumValuesFeature);
  // }, [enumValuesFeature]);

  return (
    <div className="house-form">
      <div className="form-container">
        <div className="house-form-heading">
          <h1>{heading}</h1>
        </div>
        <form onSubmit={hundelSubmit} className="form-wrapper">
          <div className="inputwrapper">
            <label>Address:</label>
            <div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Address"
              />
            </div>
          </div>
          <div className="inputwrapper-numbers">
            <div className="inputwrapper">
              <label>Bedrooms:</label>
              <div>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value))}
                  required
                  placeholder="Bedrooms"
                />
              </div>
            </div>
            <div className="inputwrapper">
              <label>Bathrooms:</label>
              <div>
                <input
                  type="number"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(parseInt(e.target.value))}
                  required
                  placeholder="Bathrooms"
                />
              </div>
            </div>
            <div className="inputwrapper">
              <label>Sqm:</label>
              <div>
                <input
                  type="number"
                  value={sqm}
                  onChange={(e) => setSqm(parseInt(e.target.value))}
                  required
                  placeholder="Sqm"
                />
              </div>
            </div>
            <div className="inputwrapper">
              <label>Availability:</label>
              <div className="inputwrapper-radio">
                <div>
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
                <div>
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
            {availability.forSale ? (
              <div className="inputwrapper">
                <label>Price:</label>
                <div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    required
                    placeholder="Price"
                  />
                </div>
              </div>
            ) : (
              <div className="inputwrapper">
                <label>RentalPrice:</label>
                <div>
                  <input
                    type="number"
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(parseInt(e.target.value))}
                    required
                    placeholder="RentalPrice"
                  />
                </div>
              </div>
            )}
            <div className="inputwrapper">
              <label>Year-Built:</label>
              <div>
                <input
                  type="number"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(parseInt(e.target.value))}
                  required
                  placeholder="Year-Built"
                />
              </div>
            </div>
            <div className="inputwrapper">
              <label>Features:</label>
              <div>
                <input
                  type="text"
                  value={enumValuesFeature}
                  multiple
                  onChange={(e) => setEnumValuesFeature(e.target.value)}
                  placeholder="Features"
                />
                <button
                  className="house-Type-btn"
                  onClick={toggleFeatureDropdown}
                >
                  {featureShowDropdown ? "🔼" : "🔽"}
                </button>
                <ul className="inputwrapper-dropdown-display">
                  {featureShowDropdown &&
                    features.map((feature, index) => {
                      return (
                        <li key={feature} style={{ textDecoration: "none" }}>
                          <label htmlFor={feature}>
                            <input
                              type="checkbox"
                              id={feature}
                              name={feature}
                              value={feature}
                              checked={enumValuesFeature.includes(feature)}
                              onChange={() => hundelFeature(feature)}
                            />
                            {feature}
                          </label>
                          {console.log(
                            "enumValuesFeature.includes(feature)....",
                            enumValuesFeature.includes(feature)
                          )}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
            <div className="inputwrapper">
              <label>City:</label>
              <div>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
            </div>
            <div className="inputwrapper">
              <label>House Type:</label>
              <div>
                <input
                  type="text"
                  value={enumValuesType}
                  className="input-house-type"
                  onChange={(e) => setEnumValuesType(e.target.value)}
                  placeholder="House-Type"
                />
                <button className="house-Type-btn" onClick={toggleDropdown}>
                  {showDropdown ? "🔼" : "🔽"}
                </button>
                <ul className="inputwrapper-dropdown-display">
                  {showDropdown &&
                    houseType.map((homeType) => {
                      return (
                        <li key={homeType}>
                          <p
                            onClick={() => hundleHouseType(homeType)}
                            className="dropdown-item"
                            value={homeType}
                          >
                            {homeType}
                          </p>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </div>
          </div>
          <div className="inputwrapper">
            <label htmlFor="description">Description</label>
            <textarea
              rows={description.length>113?"10":""} 
              cols={description.length>113?"50":""}
              className="form-control"
              id="description"
              placeholder="Enter a detailed description of your house!"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            ></textarea>
          </div>
          <div className="inputwrapper">
            <label>Images:</label>
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                name="image"
              />
            </div>

            <ul>
              {isUpdating && (
                <div className="uploaded-img">
                  {images.map((image, index) => (
                    <li key={index}>
                      <img
                        src={`${API_URL}/images/${image}`}
                        alt="uploaded-img"
                      />
                    </li>
                  ))}
                </div>
              )}
            </ul>
          </div>
          <div className="button-house-form">
            <button type="submit">
              {isUpdating ? <p>Update</p> : <p>Create</p>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HouseForm;
