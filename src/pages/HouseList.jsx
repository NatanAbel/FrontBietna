import { useDispatch, useSelector } from "react-redux"
import {selecthouses} from "../store/house/selectors"
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchedHouses } from "../store/house/thunks"


function HouseList() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const houses = useSelector(selecthouses)
  const location = useLocation().pathname

  useEffect(() => {
    dispatch(fetchedHouses);
    setIsLoading(false)
  }, [dispatch]);

  const filteredHouse = houses.filter(house => location ==="/houses/rent" ? house.availability.forRent: house.availability.forSale) 
  
  console.log("filteredHouse...",filteredHouse)

  return (
    <div>
      <div className="container-houses">
        <div className="house-cards">
          {!isLoading ? filteredHouse.map(house =>
            <div className="card-container" key={house._id}>
              <div className="card-img">
                <img src={house.images[0]} alt="House image" />
              </div>
              <div className="card-body">
                  <h1>{house.address}</h1>
                  <p><span>${house.price}</span></p>
                <div className="card-info">
                  <p>Bathrooms: {house.bathrooms}</p>
                  <p>Bedrooms: {house.bedrooms}</p>
                  <p>sqm: {house.sqm}</p>
                </div>
              </div>
            </div>
            ):<p>Loading....</p>}
        </div>
      </div>
    </div>
    
  )
}

export default HouseList