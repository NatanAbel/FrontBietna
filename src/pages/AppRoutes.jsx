import React from 'react'
import axios from "axios";
import Navbar from "../component/Navbar";
import LandingPage from "../pages/LandingPage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Footer from "../component/Footer";
import DetailsPage from "./DetailsPage.jsx";
import UpdatePage from "./UpdatePage";
import NewHousePage from "./NewHousePage";
import HouseList from "./HouseList";
import { useEffect, useRef, useState } from "react";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import { useDispatch} from "react-redux";
import { bootstrapThunkLogin } from "../store/auth/thunks";
import ProfilePage from "./ProfilePage";
import PrivateRoute from "../component/user/PrivateRoute";
import ErrorPage from "./ErrorPage";

axios.defaults.withCredentials = true;


function AppRoutes() {
    const dispatch = useDispatch();
  const [forSale, setForSale] = useState(false);
  const [forRent, setForRent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname
  const effectRun = useRef(false);

  const handleAvailabilityClick = (availabilityType) => {
    if (availabilityType === "forRent") {
      setForRent(true);
      setForSale(false);
      // setting key and value to localStorage
      localStorage.setItem("availabilityType", forRent ? "" : "forRent");
      navigate("/houses/rent");
    } else if (availabilityType === "forSale") {
      setForSale(true);
      setForRent(false);
      localStorage.setItem("availabilityType", forSale ? "" : "forSale");
      navigate("/houses/buy");
    }
  };

useEffect(() => {
 // React 18 Strict Mode
  if (effectRun.current === true || process.env.NODE_ENV !== 'development' ) {
    dispatch(bootstrapThunkLogin);
  }
  return ()=> effectRun.current = true
}, [dispatch]);

  // Set initial availability based on local storage
  useEffect(() => {
    // Retrieve availabilityType from local storage
    const availabilityType = localStorage.getItem("availabilityType");
    if (availabilityType === "forRent" ) {
      setForRent(true);
      setForSale(false);
    } else if (availabilityType === "forSale") {
      setForSale(true);
      setForRent(false);
    }

  }, []);

// 
  useEffect(() => {
    if(location === "/houses/allHouses"){
      setForRent(false);
      setForSale(false);
      localStorage.setItem("availabilityType","")
    }else if(location === "/houses/rent"){
      setForRent(true);
      setForSale(false);
      localStorage.setItem("availabilityType","forRent");
    }else if(location === "/houses/buy"){
      setForRent(false);
      setForSale(true);
      localStorage.setItem("availabilityType","forSale");
    }

    
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  },[location])

  const backButton = ()=>{
    navigate(-1)
  }

  return (
    <div className="app-container">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}
              handleAvailabilityClick={handleAvailabilityClick}
            />
          }
        />
        <Route path="/houses">
          <Route
            path="allHouses"
            element={
              <HouseList
                forRent={forRent}
                setForRent={setForRent}
                forSale={forSale}
                setForSale={setForSale}
                handleAvailabilityClick={handleAvailabilityClick}
              />
            }
          />
          <Route
            path="rent"
            element={
              <HouseList
                forRent={forRent}
                setForRent={setForRent}
                forSale={forSale}
                setForSale={setForSale}
                handleAvailabilityClick={handleAvailabilityClick}
              />
            }
          />
          <Route
            path="buy"
            element={
              <HouseList
                forRent={forRent}
                setForRent={setForRent}
                forSale={forSale}
                setForSale={setForSale}
                handleAvailabilityClick={handleAvailabilityClick}
              />
            }
          />
        </Route>
        <Route path="/housesDetails/:houseId" element={<DetailsPage  backButton={backButton}/>} />
        <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
        <Route
              path="/update/:houseId"
              element={
                <PrivateRoute>
                  <UpdatePage />
                </PrivateRoute>
              }
            />
        <Route
              path="/house/new"
              element={
                <PrivateRoute>
                  <NewHousePage />
                </PrivateRoute>
              }
            />
        <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
        <Route path="*" element={<ErrorPage/>}/> 
      </Routes>
      <Footer handleAvailabilityClick={handleAvailabilityClick} />
    </div>
  );
}

export default AppRoutes;