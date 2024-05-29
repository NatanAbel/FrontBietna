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
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import { useDispatch, useSelector } from 'react-redux'
import { bootstrapThunkLogin } from './store/auth/thunks'
import { selectLoginToken } from './store/auth/selectors'
import ProfilePage from './pages/ProfilePage'
import PrivateRoute from './component/user/PrivateRoute'

function App() {
  const dispatch = useDispatch();
  const token = useSelector(selectLoginToken);
  const [forSale, setForSale] = useState(false);
  const [forRent, setForRent] = useState(false);
  const navigate = useNavigate()

  // checking the availability of houses
  const handleAvailabilityClick = (availabilityType) => {
    if (availabilityType === 'forRent') {
      setForRent(true);
      setForSale(false);
      // setting key and value to localStorage
      console.log("forRent..........appppp", forRent)
      console.log("forSSSSSale..........appppp", forSale)
      localStorage.setItem("availabilityType", forRent ? "" : "forRent");
      navigate("/houses/rent")
    } else if (availabilityType === 'forSale') {
      setForSale(true);
      setForRent(false);
      localStorage.setItem("availabilityType", forSale ? "" : "forSale");
      navigate("/houses/buy")
    }
  };

  useEffect(() => {
    dispatch(bootstrapThunkLogin);
  }, [dispatch]);
  
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
              handleAvailabilityClick ={handleAvailabilityClick}
              />} />
          <Route path='rent' element={<HouseList forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}
              handleAvailabilityClick ={handleAvailabilityClick}
              />} />
          <Route path='buy' element={<HouseList forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}
              handleAvailabilityClick ={handleAvailabilityClick}
              />}   />
        </Route>
        <Route path='/housesDetails/:houseId' element={<DetailsPage/>}/>
        <Route path='/update/:houseId' element={<UpdatePage/>}/>
        <Route path='/house/new' element={<NewHousePage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>

        <Route path='/profile' element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>

      </Routes>
      <Footer handleAvailabilityClick ={handleAvailabilityClick}/>
    </>
  )
}

export default App
