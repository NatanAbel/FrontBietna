import React, { Suspense, useCallback } from "react";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { bootstrapThunkLogin } from "../store/auth/thunks";
import PrivateRoute from "../components/user/PrivateRoute.jsx";

const LandingPage = React.lazy(() => import("./LandingPage.jsx"));
const DetailsPage = React.lazy(() => import("./DetailsPage.jsx"));
const UpdatePage = React.lazy(() => import("./UpdatePage.jsx"));
const NewHousePage = React.lazy(() => import("./NewHousePage.jsx"));
const HouseList = React.lazy(() => import("./HouseList.jsx"));
const SignupPage = React.lazy(() => import("./SignupPage.jsx"));
const LoginPage = React.lazy(() => import("./LoginPage.jsx"));
const ProfilePage = React.lazy(() => import("./ProfilePage.jsx"));
const ErrorPage = React.lazy(() => import("./ErrorPage.jsx"));

axios.defaults.withCredentials = true;

// Add error boundaries
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

function AppRoutes() {
  const dispatch = useDispatch();
  const [forSale, setForSale] = useState(false);
  const [forRent, setForRent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const effectRun = useRef(false);

  const handleAvailabilityClick = useCallback( (availabilityType) => {
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
  }, [navigate]);

  useEffect(() => {
    // React 18 Strict Mode
    if (effectRun.current === true || process.env.NODE_ENV !== "development") {
      dispatch(bootstrapThunkLogin());
    }
    return () => (effectRun.current = true);
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
  }, []);

  //
  useEffect(() => {
    if (location === "/houses/allHouses") {
      setForRent(false);
      setForSale(false);
      localStorage.setItem("availabilityType", "");
    } else if (location === "/houses/rent") {
      setForRent(true);
      setForSale(false);
      localStorage.setItem("availabilityType", "forRent");
    } else if (location === "/houses/buy") {
      setForRent(false);
      setForSale(true);
      localStorage.setItem("availabilityType", "forSale");
    }

    // Scroll to the top of the page
    window.scrollTo(0, 0);
  }, [location]);

  const backButton = () => {
    navigate(-1);
  };

  return (
    <div className="app-container">
      <Navbar />
      <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
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
        <Route
          path="/housesDetails/:houseId"
          element={<DetailsPage backButton={backButton} />}
        />
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
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      </Suspense>
      </ErrorBoundary>
      <Footer handleAvailabilityClick={handleAvailabilityClick} />
    </div>
  );
}

export default AppRoutes;
