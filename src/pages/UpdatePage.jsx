import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import HouseForm from "../component/House/HouseForm"

const API_URL = "http://localhost:5005"

function UpdatePage() {
  const [house, setHouse] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const {houseId} = useParams()

  
  const fetchupdates = async()=>{
    const response = await axios.get(`${API_URL}/houses/${houseId}`)
    const houseToUpdate = response.data
    setHouse(houseToUpdate)
    setIsLoading(false)
  }

  useEffect(() =>{
    fetchupdates()
  },[houseId])

  return (
    <div>
      {!isLoading ? 
      <HouseForm
        heading = "Update house"
        isUpdating
        houseId = {house._id}
        houseAddress = {house.address}
        housePrice = {house.price}
        houseBedrooms = {house.bedrooms}
        houseBathrooms = {house.bathrooms}
        houseSqm = {house.sqm}
        houseRentalPrice = {house.rentalPrice}
        houseDescription = {house.description}
        houseFeatures = {house.features}
        houseImages = {house.images}
        houseAvailability = {house.availability}
      /> :<p>Loading....</p> 
    }
    </div>
  )
}

export default UpdatePage;