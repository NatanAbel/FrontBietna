import React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchedHouses } from "../store/houses/thunks";
import { selecthouses } from "../store/houses/selectors";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "../components/Search.jsx";
import "./Landing.css";
import PropTypes from "prop-types"; // For prop validation
import DOMPurify from "dompurify";
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Circles } from "react-loader-spinner";

// Create memoized search at the top of your file
const MemoizedSearch = React.memo(Search);

function LandingPage({
  forRent,
  setForRent,
  forSale,
  setForSale,
  handleAvailabilityClick,
}) {
  const dispatch = useDispatch();
  const house = useSelector(selecthouses);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // const [displayedHouses, setDisplayedHouses] = useState([]);
  const { allHouses } = house;
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const hasInitialFetchOccurred = useRef(false);

  //Add client-side caching
  const housesCache = useRef({});
  const cacheTimestamp = useRef(0);
  // Add abort controller for request cancellation
  const abortController = useRef(null);

  const handleCountryClick = (chosenCounrty) => {
    const sanitizedCountry = DOMPurify.sanitize(chosenCounrty);
    setCountry(sanitizedCountry);
    navigate("/houses/allHouses", { state: { country: sanitizedCountry } });
  };

  const handleSearch = useCallback((searchInput, searchResults) => {
    // Sanitize search inputs and results
    const sanitizedSearchInput = DOMPurify.sanitize(searchInput);
    if (searchResults !== undefined) {
      const sanitizedSearchResults = searchResults.map((result) =>
        DOMPurify.sanitize(result)
      );
      // Navigate to the HouseList page with the search input
      navigate("/houses/allHouses", {
        state: {
          search: sanitizedSearchInput,
          results: sanitizedSearchResults,
        },
      });
    } else {
      navigate("/houses/allHouses", {
        state: { search: sanitizedSearchInput, results: [] },
      });
    }
  }, [navigate]);

  const displayedHouses = useMemo(() => {
    if (allHouses?.length > 0) {
      // Use a stable sorting algorithm with a fixed seed for consistency
      const shuffled = [...allHouses].sort((a, b) => {
        // Simple hash function for addresses to create a consistent "random" order
        const hashA = a.address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hashB = b.address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return hashA - hashB;
      });
      return shuffled.slice(0, 8);
    }
    return [];
  }, [allHouses]);

  const fetchInitialData = async () => {
    if (location === "/" && !hasInitialFetchOccurred.current) {
      hasInitialFetchOccurred.current = true;
      setIsLoading(true);
      
      try {
        // Check cache
        const cacheKey = "landingPageHouses";
        const currentTime = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000;
        
        if (
          housesCache.current[cacheKey] && 
          currentTime - cacheTimestamp.current < CACHE_DURATION &&
          housesCache.current[cacheKey].length > 0
        ) {

          dispatch({
            type: "houses/housesFetched",
            payload: { allHouses: housesCache.current[cacheKey] }
          });
        } else {
          // Use separate controllers for each request
          // First fetch with its own controller - this one can be canceled safely
          const smallController = new AbortController();

          try {
            const smallResult = await dispatch(
              fetchedHouses(1, 4, { signal: smallController.signal })
            );
            // Show these immediately
            setIsLoading(false);
            // Store for cache if we don't get the full result
            if (smallResult?.result && smallResult.result.length > 0) {
              housesCache.current[cacheKey] = smallResult.result;
              cacheTimestamp.current = currentTime;
            }
          } catch (smallError) {
            // Ignore cancellation errors for the small request
            if (smallError.name !== 'CanceledError' && smallError.name !== 'AbortError') {
              throw smallError; // Re-throw non-cancellation errors
            }
          }
          // Wait a moment before fetching the full set
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Second request with a different controller
          const fullController = new AbortController();
          abortController.current = fullController; // Store for cleanup
          
          try {
            const fullResult = await dispatch(
              fetchedHouses(1, 16, { signal: fullController.signal })
            );
            
            // Update cache with full result
            if (fullResult?.result && fullResult.result.length > 0) {
              housesCache.current[cacheKey] = fullResult.result;
              cacheTimestamp.current = currentTime;
            }
          } catch (fullError) {
            // Only log non-cancellation errors
            if (fullError.name !== 'CanceledError' && fullError.name !== 'AbortError') {
              console.error("Failed to fetch full house data:", fullError);
            }
          }
        }
      } catch (error) {
        // Only log non-cancellation errors
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          console.error("Failed to fetch houses:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
// Implement proper caching mechanism with async/await
useEffect(() => {
  fetchInitialData();
   // Cleanup function
   return () => {
    if (abortController.current) {
      abortController.current.abort();
    }
  };
}, [dispatch, location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [allHouses]);

  return (
    <div className="landing-container">
      <header className="header">
        <div className="header-content">
          <h1>Welcome to Bietna</h1>
          {/* <div className="header-button">
              <button className="my-button" onClick={()=>handleCountryClick("Eritrea")}>
              Eritrea
              </button>
              
              <button className="my-button" onClick={()=>handleCountryClick("Uganda")}>
               Uganda
              </button>
              <button className="my-button" onClick={()=>handleCountryClick("Ethiopia")}>
               Ethiopia
              </button>
          </div>  */}
          <div className="landing-search-input">
            <MemoizedSearch
              houses={allHouses}
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              forRent={forRent}
              setForRent={setForRent}
              forSale={forSale}
              setForSale={setForSale}
            />
          </div>
        </div>
      </header>
      <main className="main">
        <div className="slide-listing">
          <div className="main-text">
            <h2>Houses Sell & Rent </h2>
          </div>
          <div className="landing-gallery-wrapper">
            {!isLoading ? (
              <div className="cards-swiper-container">
                <Swiper
                  effect={"coverflow"}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={"auto"}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  pagination={true}
                  navigation={true}
                  modules={[EffectCoverflow, Pagination, Navigation]}
                  className="mySwiper"
                >
                  {displayedHouses.map((house) => (
                    <SwiperSlide key={house._id}>
                      <div className="details-card-wrapper">
                        <Link to={`/housesDetails/${house._id}`}>
                          <img
                            src={house.images[0]}
                            alt={`Image of house at ${DOMPurify.sanitize(
                              house.address
                            )}`}
                            className="swiper-img"
                            loading="lazy"
                          />
                          <div className="details-card">
                            <div>
                              <h2>{DOMPurify.sanitize(house.address)}</h2>
                              <p>
                                {" "}
                                $
                                {house.availability.forRent
                                  ? house.rentalPrice.toLocaleString()
                                  : house.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <Circles
                height="80"
                width="80"
                color="black"
                ariaLabel="circles-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
            )}
          </div>
          <Link to="/houses/allHouses" className="View-all-btn">
            View All
          </Link>
        </div>
        <div className="cards-wrapper">
          <div className="cards">
            <div
              className="card-buy-rent"
              onClick={() => handleAvailabilityClick("forSale")}
            >
              {/* <Link to="/houses/buy" className="cards-link"> */}
              <h4>House To Buy</h4>
              <div className="card-img-container">
                <img
                  className="card-buy-image"
                  src="/images/house-for-sell.jpg"
                />
              </div>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore
                amet eius sequi inventore.
              </p>
              <button
                className="card-button"
                onClick={() => handleAvailabilityClick("forSale")}
              >
                Buy
              </button>
              {/* </Link> */}
            </div>
            {/* <div className="card-buy-rent">
              <Link className="cards-link">
                <h4>House To Sell</h4>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dolore amet eius sequi inventore. Neque iure quod illum
                  officia cum est nesciunt eum rerum! Aliquid, magnam.
                </p>
              </Link>
            </div> */}
            <div
              className="card-buy-rent"
              onClick={() => handleAvailabilityClick("forRent")}
            >
              {/* <Link to="/houses/rent" className="cards-link"> */}
              <h4>House To Rent</h4>
              <div className="card-buy-img">
                <img
                  style={{ width: "160px", height: "120px", margin: "15px" }}
                  src="/images/house-for-rent.jpg"
                />
              </div>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore
                amet eius sequi inventore.
              </p>
              <button
                className="card-button"
                onClick={() => handleAvailabilityClick("forRent")}
              >
                Rent
              </button>
              {/* </Link> */}
            </div>
          </div>
        </div>
        <div className="main-contact-us">
          <div className="contact-us-info">
            <h3>Contact Us</h3>
            <p>
              We'd love to hear from you! Whether you have a question, feedback,
              or need support, feel free to get in touch with us using the
              information below.
            </p>
            <p>Email: support@bietna.com</p>
            <p>Phone: +1 (123) 456-7890</p>
            <p>Address: 123 Street, City, Country</p>
          </div>
          <div className="contact-us-img">
            <img src="/images/contact-us-img.jpeg" alt="contact us image" />
          </div>
        </div>
      </main>
    </div>
  );
}

// Prop validation
LandingPage.propTypes = {
  forRent: PropTypes.bool.isRequired,
  setForRent: PropTypes.func.isRequired,
  forSale: PropTypes.bool.isRequired,
  setForSale: PropTypes.func.isRequired,
  handleAvailabilityClick: PropTypes.func.isRequired,
};

export default LandingPage;
