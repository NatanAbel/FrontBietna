import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HouseForm from "../components/House/HouseForm";
import DOMPurify from "dompurify";

const API_URL = import.meta.env.VITE_BACK_URL;

function UpdatePage() {
  const [house, setHouse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { houseId } = useParams();

  const fetchupdates = async () => {
    const response = await axios.get(`${API_URL}/houses/${houseId}`);
    const houseToUpdate = response.data;
    setHouse(houseToUpdate);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchupdates();
  }, [houseId]);

  return (
    <div>
      {!isLoading ? (
        <HouseForm
          heading="Update house"
          isUpdating
          house={house}
          setHouse={setHouse}
          houseId={house._id}
          houseAddress={DOMPurify.sanitize(house.address)}
          housePrice={house.price}
          houseBedrooms={house.bedrooms}
          houseBathrooms={house.bathrooms}
          houseSqm={house.sqm}
          houseRentalPrice={house.rentalPrice}
          houseDescription={DOMPurify.sanitize(house.description)}
          houseFeatures={house.features}
          houseImages={house.images}
          houseAvailability={house.availability}
          houseYearBuilt={house.yearBuilt}
          houseCountry={DOMPurify.sanitize(house.country)}
          homeType={house.homeType}
          homeCity={DOMPurify.sanitize(house.city)}
        />
      ) : (
        <p>Loading....</p>
      )}
    </div>
  );
}

export default UpdatePage;
