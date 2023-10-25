import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function HouseForm(props) {
  const {
    heading,
    isUpdating,
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

  const [address, setAddress] = useState(houseAddress);
  const [price, setPrice] = useState(housePrice);
  const [bedrooms, setBedrooms] = useState(houseBedrooms);
  const [bathrooms, setBathrooms] = useState(houseBathrooms);
  const [sqm, setSqm] = useState(houseSqm);
  const [rentalPrice, setRentalPrice] = useState(houseRentalPrice);
  const [description, setDescription] = useState(houseDescription);
  const [features, setFeatures] = useState(houseFeatures);
  const [images, setImages] = useState(houseImages);
  const [availability, setAvailability] = useState(houseAvailability || {forRent:true, forSale:false});

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    // Get the selected files from the input element
    const selectedFiles = e.target.files;

    // Convert the FileList to an array and update the state
    setImages(Array.from(selectedFiles));
  };

  const hundelSubmit = async (e) => {
    e.preventDefault();
    try {

      const body = {address, price, bedrooms, bathrooms, sqm, rentalPrice, description,features, availability
      };

    
      if (!images || images.length === 0) {
          // Handle the case where no files are selected
          return;
      }
    
      const formData = new FormData();

      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      // Add formData to the body if images exist
      if(images && images.length > 0) {
        body.images = formData; // Send the FormData object
      }


      const response = await axios.post(`${API_URL}/houses/new`, body, {
        headers: {
          "Content-Type": "multipart/form-data"},// Set the content type to handle file uploads
        });
      const houseCreated = response.data;
      console.log("houseCreated......", houseCreated)
      
      if (response.status === 201) {
        navigate(`/housesDetails/${houseCreated._id}`);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div style={{ marginTop: "90px", marginLeft: "70px" }}>
      <h1>{heading}</h1>
      <form onSubmit={hundelSubmit}>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Price :</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>Bedrooms:</label>
          <input
            type="number"
            value={bedrooms}
            onChange={(e) => setBedrooms(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>bathrooms:</label>
          <input
            type="number"
            value={bathrooms}
            onChange={(e) => setBathrooms(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>sqm:</label>
          <input
            type="number"
            value={sqm}
            onChange={(e) => setSqm(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>rentalPrice:</label>
          <input
            type="number"
            value={rentalPrice}
            onChange={(e) => setRentalPrice(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>features:</label>
          <input
            type="text"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </div>
        <div>
          <label>images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {/* <button type="button" onClick={handleUpload}></button> */}
        </div>
        <div>
          <label>availability:</label>
          <div>
            
            <input
              type="radio"
              id="rent"
              value="forRent"
              name="availability"
              checked={availability.forRent}
              onChange={() => setAvailability({forRent:true, forSale:false})}
            />
            <label htmlFor="rent" >Rent</label>
          </div>
          <div>
            
            <input
              type="radio"
              id="sale"
              value="forSale"
              name="availability"
              checked={availability.forSale}
              onChange={() => setAvailability({forRent:false, forSale:true})}
            />
            <label htmlFor="sale" >Sale</label>
          </div>
        </div>
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  );
}

export default HouseForm;
