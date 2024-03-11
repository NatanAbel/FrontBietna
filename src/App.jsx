import Navbar from './component/Navbar'
import './App.css'
import LandingPage from './pages/LandingPage'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Footer from './component/Footer'
import DetailsPage from './pages/detailsPage'
import UpdatePage from './pages/updatePage'
import NewHousePage from './pages/NewHousePage'
import HouseList from './pages/HouseList'
import { useEffect, useState } from 'react'

function App() {

  const [forSale, setForSale] = useState(false);
  const [forRent, setForRent] = useState(false);
  const navigate = useNavigate()

  // checking the availability of houses
  const handleAvailabilityClick = (availabilityType) => {
    if (availabilityType === 'forRent') {
      setForRent(!forRent);
      setForSale(forSale);
      // setting key and value to localStorage
      console.log("forRent..........appppp", forRent)
      console.log("forSSSSSale..........appppp", forSale)
      localStorage.setItem("availabilityType", forRent ? "" : "forRent");
      navigate("/houses/rent")
    } else if (availabilityType === 'forSale') {
      setForSale(!forSale);
      setForRent(forRent);
      localStorage.setItem("availabilityType", forSale ? "" : "forSale");
      navigate("/houses/buy")
    }
  };
  console.log("forSSSSSale..........appppp", forSale)
  console.log("forRent..........appppp", forRent)
  
    // Set initial availability based on local storage
  useEffect(() => {
    // Retrieve availabilityType from local storage
    const availabilityType = localStorage.getItem("availabilityType");
    if (availabilityType === "forRent") {
      setForRent(true);
      setForSale(false);
    } else if (availabilityType === "forSale") {
      setForSale(true);
      setForRent(false);
    }
  }, [forRent, forSale]);

  return (
    <> 
      <Navbar/>
      <Routes>
        <Route path='/' element={<LandingPage  forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}
              handleAvailabilityClick={handleAvailabilityClick}/>} />
        <Route path="/houses">
          <Route path='allHouses' element={<HouseList  forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}
              />} />
          <Route path='rent' element={<HouseList forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}/>} />
          <Route path='buy' element={<HouseList forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}/>}   />
        </Route>
        <Route path='/housesDetails/:houseId' element={<DetailsPage/>}/>
        <Route path='/update/:houseId' element={<UpdatePage/>}/>
        <Route path='/house/new' element={<NewHousePage/>}/>


      </Routes>
      <Footer handleAvailabilityClick ={handleAvailabilityClick}/>
    </>
  )
}

export default App
