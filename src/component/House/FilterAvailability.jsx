import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function FilterAvailability({ forRent, setForRent, forSale, setForSale }) {
  const navigate = useNavigate();
  const location = useLocation() 
  const [selectedOption, setSelectedOption] = useState("");
  const{pathname} = location

  const handleAvailabilityChange = (availabilityType) => {
    if (availabilityType === "forRent" && !forRent ) {
      console.log("forRenttttttttt...11111", forRent);
      setForRent(true);
      setForSale(false);
      setSelectedOption("forRent");
      localStorage.setItem("availabilityType", "forRent"); // Store in local storage
      navigate("/houses/rent");
    } else if (availabilityType === "forSale" && !forSale) {
      console.log("forRenttttttttt...2222", forRent);
      setForSale(true);
      setForRent(false);
      setSelectedOption("forSale");
      localStorage.setItem("availabilityType", "forSale");
      navigate("/houses/buy");
    }
  };

  useEffect(() => {
    const value = localStorage.getItem("availabilityType");
    setSelectedOption(value || "");
    // console.log("setSelectedOption......33333", value);
    // console.log("setSelectedOption......-1-1--1", selectedOption);
  }, [forRent, forSale]);

  return (
    <div className="availability-filters">
      <div className="availability-input-wrapper">
        <p>
          {" "}
          {selectedOption === "forRent" ?(
            <span>For Rent</span>
          ) : (
            <span>For Sale</span>
          )}{" "}
        </p>
        <div className="availability-dropdown">
          <div className="navButton">
            <div>
              <input
                type="radio"
                id="forRent"
                name="availability"
                className="radio-button"
                checked={forRent}
                onChange={() => handleAvailabilityChange("forRent")}
              />
              <label htmlFor="forRent" className="radio-button">
                For Rent
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="forSale"
                name="availability"
                className="radio-button"
                checked={forSale}
                onChange={() => handleAvailabilityChange("forSale")}
              />
              <label htmlFor="forSale" className="radio-button">
                For Sale
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterAvailability;
