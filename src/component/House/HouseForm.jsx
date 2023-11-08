import { getType } from "@reduxjs/toolkit";
import axios from "axios";
import React, { useState } from "react";
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
  const [price, setPrice] = useState(housePrice || 0);
  const [bedrooms, setBedrooms] = useState(houseBedrooms || 0);
  const [bathrooms, setBathrooms] = useState(houseBathrooms || 0);
  const [sqm, setSqm] = useState(houseSqm || 0);
  const [rentalPrice, setRentalPrice] = useState(houseRentalPrice || 0);
  const [description, setDescription] = useState(houseDescription || "");
  const [features, setFeatures] = useState(houseFeatures || []);
  const [images, setImages] = useState(houseImages || []);
  const [availability, setAvailability] = useState(
    houseAvailability || { forRent: true, forSale: false }
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
      // const houseCreated = responsePost.data;
      // console.log("houseCreated......", houseCreated)
      const houseData = response.data;
      console.log("houseData......", houseData);

      if (response.status === 201 || response.status === 200) {
        navigate(`/housesDetails/${houseData._id}`);
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
            name="image"
          />
          <ul>
            {images.map((image, index) => (
              <li key={index}>
                <img
                  style={{ width: "50px" }}
                  src={`${API_URL}/images/${image}`}
                  alt=""
                />
              </li>
            ))}
          </ul>
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
              onChange={() =>
                setAvailability({ forRent: true, forSale: false })
              }
            />
            <label htmlFor="rent">Rent</label>
          </div>
          <div>
            <input
              type="radio"
              id="sale"
              value="forSale"
              name="availability"
              checked={availability.forSale}
              onChange={() =>
                setAvailability({ forRent: false, forSale: true })
              }
            />
            <label htmlFor="sale">Sale</label>
          </div>
        </div>
        <div>
          <button type="submit">
            {isUpdating ? <p>update</p> : <p>create</p>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HouseForm;
