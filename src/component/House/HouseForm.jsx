import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  } = props;

  const [address, setAddress] = useState(houseAddress || "");
  const [price, setPrice] = useState(housePrice ||0);
  const [bedrooms, setBedrooms] = useState(houseBedrooms ||0);
  const [bathrooms, setBathrooms] = useState(houseBathrooms ||0);
  const [sqm, setSqm] = useState(houseSqm ||0);
  const [rentalPrice, setRentalPrice] = useState(houseRentalPrice ||0);
  const [description, setDescription] = useState(houseDescription || "");
  const [features, setFeatures] = useState(houseFeatures || []);
  const [images, setImages] = useState(houseImages || []);
  const [availability, setAvailability] = useState(
    houseAvailability || { forRent:true , forSale: false }
  );

  const navigate = useNavigate();

  const handleFileChange = async (e) => {
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

        // checking if for rent is false and update the state in order to send input rental field to the backend
        // if (!availability.forRent) {
        //   setRentalPrice(0)     
        // }
        
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const hundelSubmit = async (e) => {
    e.preventDefault();
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
      formData.append("features", features);
      formData.append("availability", JSON.stringify(availability));

      const response = isUpdating
        ? await axios.put(`${API_URL}/houses/${houseId}/update`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }, // Set the content type to handle file uploads
          })
        : await axios.post(`${API_URL}/houses/new`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            }, // Set the content type to handle file uploads
          });

      const houseData = response.data;
      console.log(houseData)
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
      setRentalPrice(0)     
    }
    // Reset price to zero if switching from sale to rent
    if (availability.forSale && forRent) {
      setPrice(0);     
    }
    // Update the availability state
    setAvailability({ forRent, forSale: !forRent });
  };


  return (
    <div  className="checkllll">
      <div className="form-container" >
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
                  onChange={() =>
                    handleAvailabilityChange(true)
                  }
                />
                <label htmlFor="rent" className="text-radio">Rent</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="sale"
                  value="forSale"
                  name="availability"
                  checked={availability.forSale}
                  onChange={() =>handleAvailabilityChange(false)}
                />
                <label htmlFor="sale" className="text-radio">Sale</label>
              </div>
              </div>
            </div>
              {availability.forSale ? (<div className="inputwrapper">
                <label>Price :</label>
                <div>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  required
                  placeholder="Price" 
                />
                </div>
              </div>) : (<div className="inputwrapper">
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
              </div>)}
            <div className="inputwrapper">
            <label>Features:</label>
            <div>
            <input
              type="text"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Features"
            />
            </div>
          </div>
          </div>
          <div className="inputwrapper">
            <label htmlFor="description">Description</label>
                <textarea maxLength="250" className="form-control" id="description" placeholder="Enter a detailed description of your house!" value={description} onChange={(event) => setDescription(event.target.value)}  required></textarea>
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
            {isUpdating && <div  className="uploaded-img" >
              {images.map((image, index) => (
                <li key={index}>
                    <img
                      src={`${API_URL}/images/${image}`}
                      alt="uploaded-img"
                    />
                  </li>
              ))}
              </div> }
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
