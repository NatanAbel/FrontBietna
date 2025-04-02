import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDetailsPage } from "../store/houseDetails/thunks";
import { selectHouseDetail } from "../store/houseDetails/selectors";
import { selecthouses } from "../store/houses/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBathtub,
  faBed,
  faLocationDot,
  faRulerCombined,
  faTentArrowTurnLeft,
} from "@fortawesome/free-solid-svg-icons";
import { fetchedHouses } from "../store/houses/thunks";

import { Swiper, SwiperSlide } from "swiper/react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import ModalDetailsPage from "../components/House/ModalDetailsPage.jsx";
import "./DetailsPage.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  FreeMode,
  Thumbs,
} from "swiper/modules";

function escapeHTML(str) {
  return str.replace(/[&<>"'`=/]/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#x60;",
      "=": "&#x3D;",
      "/": "&#x2F;",
    }[s];
  });
}

function DetailsPage({ backButton }) {
  const house = useSelector(selectHouseDetail);
  const houses = useSelector(selecthouses);
  const dispatch = useDispatch();
  const { houseId } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(null);
  const [homeRelated, setHomeRelated] = useState([]);
  const [swiperKey, setSwiperKey] = useState(0);
  const { allHouses } = houses;
  const navigate = useNavigate();

  const handleModalImage = (index) => {
    setSelectedThumbnailIndex(index);
  };

  // Helper function to calculate match score
  const getMatchScore = (home, currentHouse) => {
    let score = 0;

    // Highest priority: same city
    if (home.city === currentHouse.city) score += 100;

    // Price range matches
    if (currentHouse.availability?.forSale) {
      const priceDiff = Math.abs(home.price - currentHouse.price);
      if (priceDiff <= 25000) score += 50;
      else if (priceDiff <= 50000) score += 25;
    }

    // Rental price matches
    if (currentHouse.availability?.forRent) {
      const rentalDiff = Math.abs(home.rentalPrice - currentHouse.rentalPrice);
      if (rentalDiff <= 5000) score += 50;
      else if (rentalDiff <= 10000) score += 25;
    }

    // Additional matching criteria
    if (home.homeType === currentHouse.homeType) score += 20;
    if (home.bedrooms === currentHouse.bedrooms) score += 15;
    if (home.bathrooms === currentHouse.bathrooms) score += 15;

    return score;
  };

  const relatedHouses = (house) => {
    if (!house || !allHouses || !Array.isArray(allHouses)) return;

    // Single filter operation that combines all conditions
    const matchedHomes = allHouses.filter((home) => {
      // First, ensure we're not including the current house
      if (home._id === house._id) return false;

      // Then check if it's in the same country
      if (home.country !== house.country) return false;

      // Check if any of our matching criteria are met
      const isSameCity = home.city === house.city;
      const isInPriceRange =
        house.availability?.forSale &&
        Math.abs(home.price - house.price) <= 50000;
      const isInRentalRange =
        house.availability?.forRent &&
        Math.abs(home.rentalPrice - house.rentalPrice) <= 10000;
      const isSameAvailabilityType =
        home.availability?.forRent === house.availability?.forRent &&
        home.availability?.forSale === house.availability?.forSale;

      // Return true if any matching criteria is met AND it's the same availability type
      return (
        isSameAvailabilityType && 
        (isSameCity || isInPriceRange || isInRentalRange)
      );
    });

    // Sort by relevance (city match first, then price range)
    const sortedHomes = matchedHomes.sort((a, b) => {
      const aScore = getMatchScore(a, house);
      const bScore = getMatchScore(b, house);
      return bScore - aScore;
    });

    setHomeRelated(sortedHomes);
  };

  const clickRelatedHouse = (e, houseId) => {
    e.preventDefault();
    e.stopPropagation();
    // Clear related houses before navigation
    if (houseId) {
      // Clear related houses before navigation
      setHomeRelated([]);
      navigate(`/housesDetails/${houseId}`);
    }
  };

  // Capitalize the first letter of the text
  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

  useEffect(() => {
    dispatch(fetchDetailsPage(houseId));
    dispatch(fetchedHouses(1, 12));
    // Scroll to the top of the page
    // window.scrollTo(0, 0);
  }, [dispatch, houseId]);

  useEffect(() => {
    // avoiding scrolling while modal is open
    if (selectedThumbnailIndex !== null) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
  }, [selectedThumbnailIndex]);

  useEffect(() => {
    if (house && allHouses.length > 0) {
      // Reset related houses when navigating to a new house
      setHomeRelated([]);
      relatedHouses(house);
      setSwiperKey(prev => prev + 1);
    }
  }, [house?._id, allHouses]);

  return (
    <div className="details-container">
      {selectedThumbnailIndex !== null && (
        <div className="modal">
          <ModalDetailsPage
            house={house}
            toggleModal={handleModalImage}
            selectedThumbnailIndex={selectedThumbnailIndex}
          />
        </div>
      )}
      {house ? (
        <>
          <div className="details-favourite-back">
            <button onClick={backButton} className="back-button">
              <FontAwesomeIcon
                icon={faTentArrowTurnLeft}
                className="back-icon"
              />
              Back
            </button>
          </div>
          <div className="details-wrapper">
            <div className="details-content">
              <div className="house-details">
                <div className="gallary-swiper-img">
                  <Swiper
                    style={{
                      "--swiper-navigation-color": "#fff",
                      "--swiper-pagination-color": "#fff",
                    }}
                    spaceBetween={10}
                    loop={house.images.length > 1} // Enable loop only if there are more than 1 image
                    slidesPerGroup={1}
                    navigation={true}
                    thumbs={{
                      swiper:
                        thumbsSwiper && !thumbsSwiper.destroyed
                          ? thumbsSwiper
                          : null,
                    }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2"
                  >
                    {house.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          className="large-img"
                          src={image}
                          alt={`Image-index ${index}`}
                          loading="lazy"
                          onClick={() => handleModalImage(index)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4} // Show up to 4 slides
                    slidesPerGroup={1} // Move one slide at a time
                    loop={house.images.length > 4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper-gallery"
                  >
                    {house.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`Image-index ${index}`}
                          loading="lazy"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="house-details-box">
                  <div className="room-status-container">
                    <div className="status-home-type">
                      <div>
                        <p className="text-status">
                          {capitalize(house.homeType)}
                        </p>
                      </div>
                      <div>
                        {house.availability.forRent ? (
                          <p className="text-status">For Rent</p>
                        ) : (
                          <p className="text-status">For Sale</p>
                        )}
                      </div>
                    </div>
                    <div className="room-details-wrapper">
                      <div className="room-details">
                        <p className="rooms-text">
                          <FontAwesomeIcon
                            icon={faBed}
                            className="details-icon"
                          />
                          {house.bedrooms}
                        </p>
                      </div>
                      <div className="room-details">
                        <p className="rooms-text">
                          <FontAwesomeIcon
                            icon={faBathtub}
                            className="details-icon"
                          />
                          {house.bathrooms}
                        </p>
                      </div>
                      <div className="room-details">
                        <p className="rooms-text">
                          <FontAwesomeIcon
                            icon={faRulerCombined}
                            className="details-icon"
                          />
                          {house.sqm} m²
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="house-address-price">
                    <h1>{escapeHTML(house.address)}</h1>
                    <p className="details-text">
                      $
                      {house.availability.forRent
                        ? `${house.rentalPrice.toLocaleString()} /month`
                        : house.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="house-place">
                    <p>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="details-icon"
                      />
                      {escapeHTML(
                        `${house.address}, ${house.city}, ${house.country}`
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="general-house-info">
                <div className="house-details-dropdown">
                  <div className="house-info">
                    <div>
                      <h2>Details</h2>
                      <div className="info-details">
                        <div className="info-right-left">
                          <div className="details-left-info">
                            <div className="left-info">
                              <p className="label-info">Bedrooms :</p>
                              <p>
                                <FontAwesomeIcon
                                  icon={faBed}
                                  className="details-icon"
                                />
                                {house.bedrooms} Beds
                              </p>
                            </div>
                            <div className="left-info">
                              <p className="label-info">Bathrooms :</p>
                              <p>
                                <FontAwesomeIcon
                                  icon={faBathtub}
                                  className="details-icon"
                                />
                                {house.bathrooms} Baths
                              </p>
                            </div>
                            <div className="left-info">
                              <p className="label-info">House type :</p>
                              <p>{capitalize(house.homeType)}</p>
                            </div>
                            <div className="left-info">
                              <p className="label-info">City :</p>
                              <p>{capitalize(house.city)}</p>
                            </div>
                          </div>
                          <div className="details-right-info">
                            <div className="right-info">
                              <p className="label-info">Country :</p>
                              <p>{capitalize(house.country)}</p>
                            </div>
                            <div className="right-info">
                              <p className="label-info">Area:</p>
                              <p>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faRulerCombined}
                                  className="details-icon"
                                />
                                {house.sqm} m²
                              </p>
                            </div>
                            <div className="right-info">
                              <p className="label-info">Year :</p>
                              <p>{house.yearBuilt}</p>
                            </div>
                            <div className="right-info">
                              <p className="label-info">Status :</p>
                              <p>
                                {house.availability.forRent
                                  ? "For Rent"
                                  : "For Sale"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="feature-details-info">
                          <div>
                            <p className="label-info">Features</p>
                          </div>
                          <div className="feature-list-info">
                            {house.features.map((feature, index) => (
                              <p
                                key={`${feature}-${index}`}
                                className="feature-list"
                              >
                                {capitalize(feature)}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                      <h2>Description</h2>
                      <div className="info-details">
                        <p
                          className="description-text"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(house.description),
                          }}
                        ></p>
                      </div>
                    </div>

                    <div>
                      <h2>
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          style={{ fontSize: "16px", padding: "0rem .5rem" }}
                        />
                        Location
                      </h2>
                      <div className="map-info">
                        <iframe
                          src={`https://www.google.com/maps?q=${house.latitude},${house.longitude}&hl=es;z=14&output=embed`}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="contact-us-container">
              <div className="contact-us-box">
                <h2>Bietna</h2>
                <div>
                  <input
                    type="text"
                    className="contact-us-info"
                    placeholder="Firstname"
                  />
                  <input
                    type="text"
                    className="contact-us-info"
                    placeholder="Lastname"
                  />
                  <input
                    type="email"
                    className="contact-us-info"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    className="contact-us-info"
                    placeholder="Phonenumber"
                  />
                  <textarea
                    row="10"
                    col="50"
                    placeholder="Which property are you interested in? Please provide details..."
                  ></textarea>
                </div>
                <button className="contact-button">Contact Us </button>
              </div>
            </div>
          </div>
          <div className="card-related-houses">
            <h2>Related Houses</h2>
            <div className="cards-swiper-container">
              <div className="related-country">
                <p className="related-country-status">{house.country}</p>
              </div>
              <Swiper
                key={swiperKey}
                effect={homeRelated.length > 1 ? "coverflow" : "slide"}
                grabCursor={true}
                centeredSlides={homeRelated.length > 1}
                slidesPerView={homeRelated.length > 1}
                initialSlide={0}
                coverflowEffect={{
                  rotate: 30,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={homeRelated.length > 1}
                navigation={homeRelated.length > 1}
                modules={[EffectCoverflow, Pagination, Navigation]}
                className="mySwiper"
                touchEventsTarget="container"
                preventClicks={false}
                preventClicksPropagation={false}
                touchStartPreventDefault={false}
                watchSlidesProgress={true}
                threshold={5} // Lower threshold for swipe detection
                touchRatio={1} // Increase touch ratio
                touchAngle={45} // More forgiving touch angle
                simulateTouch={true}
                // Add breakpoints for better mobile handling
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    centeredSlides: true,
                    effect: "slide",
                  },
                  480: {
                    slidesPerView: "auto",
                    effect: homeRelated.length > 1 ? "coverflow" : "slide",
                  },
                }}
              >
                {homeRelated.length > 0 ? (
                  homeRelated.slice(0, 8).map((house) => (
                    <SwiperSlide key={house._id}>
                      <div className="details-card-wrapper">
                        <div
                          className="related-card-link"
                          onClick={(e) => clickRelatedHouse(e, house._id)}
                        >
                          <img
                            src={house.images[0]}
                            alt="images"
                            className="swiper-img"
                            loading="lazy"
                          />
                          <div className="details-card">
                            <h2>{house.address}</h2>
                            <p>
                              {" "}
                              $
                              {house.availability.forRent
                                ? house.rentalPrice.toLocaleString()
                                : house.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <p className="no-related-houses">
                    Sorry, no related houses found!
                  </p>
                )}
              </Swiper>
            </div>
          </div>
        </>
      ) : (
        <p>Loading.....</p>
      )}
    </div>
  );
}
export default DetailsPage;
