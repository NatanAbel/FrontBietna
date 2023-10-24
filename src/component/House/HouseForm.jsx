import React, { useState } from 'react'

function HouseForm({heading,isUpdating,houseId,houseAddress,housePrice,houseBedrooms,houseBathrooms,houseSqm,houseRentalPrice,houseDescription,houseFeatures,houseImages,houseAvailability} ) {
  // const = props

  const[address, setAddress] = useState(houseAddress)
  const[price , setPrice] = useState(housePrice)
  const[bedrooms , setBedrooms] = useState(houseBedrooms)
  const[bathrooms , setBathrooms] = useState(houseBathrooms)
  const[sqm , setSqm] = useState(houseSqm)
  const[rentalPrice , setRentalPrice] = useState(houseRentalPrice)
  const[description , setDescription] = useState(houseDescription)
  const[features , setFeatures] = useState(houseFeatures)
  const[images , setImages] = useState(houseImages)
  const[availability , setAvailability] = useState(houseAvailability)


  // const hundelSubmit = async(e)=>{

  // }

  return (
    <div style={{marginTop:"300px"}}>
      <h1>{heading}</h1>
      <form>
        <div>
          <label >Address:</label>
          <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)}/>
        </div>
        <div>
          <label >Price :</label>
          <input type="text" value={price} onChange={(e)=>setPrice(e.target.value)}/>
        </div>
        <div>
          <label >Bedrooms:</label>
          <input type="text" value={bedrooms} onChange={(e)=>setBedrooms(e.target.value)}/>
        </div>
        <div>
          <label >bathrooms:</label>
          <input type="text" value={bathrooms} onChange={(e)=>setBathrooms(e.target.value)}/>
        </div>
        <div>
          <label >sqm:</label>
          <input type="text" value={sqm} onChange={(e)=>setSqm(e.target.value)}/>
        </div>
        <div>
          <label >rentalPrice:</label>
          <input type="text" value={rentalPrice} onChange={(e)=>setRentalPrice(e.target.value)}/>
        </div>
        <div>
          <label >description:</label>
          <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)}/>
        </div>
        <div>
          <label >features:</label>
          <input type="text" value={features} onChange={(e)=>setFeatures(e.target.value)}/>
        </div>
        <div>
          <label >images:</label>
          <input type="text" value={images} onChange={(e)=>setImages(e.target.value)}/>
        </div>
        <div>
          <label >availability:</label>
          <input type="text" value={availability} onChange={(e)=>setAvailability(e.target.value)}/>
        </div>
      </form>
    </div>
    
  )
}

export default HouseForm