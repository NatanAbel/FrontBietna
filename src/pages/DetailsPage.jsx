import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDetailsPage } from "../store/houseDetails/thunks";
import { selectHouseDetail } from "../store/houseDetails/selectors";
import { selecthouses } from "../store/houses/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesDown,
  faAnglesUp,
  faBathtub,
  faBed,
  faCaretDown,
  faRuler,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import { fetchedHouses } from "../store/houses/thunks";

import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/effect-cube";

// import required modules
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  FreeMode,
  Thumbs,
  EffectCube,
} from "swiper/modules";

const API_URL = "http://localhost:5005/images";

function DetailsPage() {
  const house = useSelector(selectHouseDetail);
  const Allhouses = useSelector(selecthouses);
  const dispatch = useDispatch();
  const { houseId } = useParams();
  const [showDetails, setShowDetails] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const { houses, favorites } = Allhouses;

  const detailsToggle = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    dispatch(fetchDetailsPage(houseId));
    dispatch(fetchedHouses);
  }, [dispatch, houseId]);

  // useEffect(() => {
  //   showSlides(slideIndex);
  // }, [slideIndex]);

  return (
    <div className="details-container">
      {house ? (
        <div className="details-wrapper">
          <div className="house-details">
            <div className="gallary-swiper-img">
              {/*house.images.map((image, index) =>
    <div className="carousel-item active" key={index}>
      <img src={image} width= "800px" height="592px" className="d-block" alt="..."/>
    </div>

)*/}
              <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                effect={"cube"}
                cubeEffect={{
                  shadow: true,
                  slideShadows: true,
                  shadowOffset: 20,
                  shadowScale: 0.94,
                }}
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, EffectCube]}
                className="mySwiper2"
              >
                {house.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${API_URL}/${image}`}
                      alt={`Image-index ${index}`}
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper-gallery"
              >
                {house.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={`${API_URL}/${image}`}
                      alt={`Image-index ${index}`}
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="house-details-box">
              <div className="house-address-price">
                <h1>{house.address}</h1>
                <p className="details-text">${house.rentalPrice}</p>
              </div>

              <div className="room-details-wrapper">
                <div className="room-details">
                  <FontAwesomeIcon icon={faBed} />
                  <p>bedrooms: {house.bedrooms}</p>
                </div>
                <div className="room-details">
                  <p className="rooms-text">
                    <FontAwesomeIcon icon={faBathtub} />
                    bathrooms: {house.bathrooms}
                  </p>
                </div>
                <div className="room-details">
                  <p className="rooms-text">
                    {" "}
                    {<FontAwesomeIcon icon={faRulerCombined} />} sqm:{" "}
                    {house.sqm}
                  </p>
                </div>
              </div>
              <button>Contact Us </button>
            </div>
          </div>
          <div className="general-house-info">
            <div className="general-house-title">
              
              <h1>house details</h1>
              <button className="button-hide-show" onClick={detailsToggle}>
                {showDetails ? (
                  <FontAwesomeIcon icon={faAnglesDown} />
                ) : (
                  <FontAwesomeIcon icon={faAnglesUp} />
                )}
              </button>
            </div>
            <div
              className="house-details-dropdown"
              style={showDetails ? { display: "block" } : { display: "none" }}
            >
              <div className="house-info">
                <div className="map-info">
                  <h1>Map</h1>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.837259239149!2d4.653629776675463!3d52.373370847075215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5ef5f774567c5%3A0xb8ba8b9c0080cc53!2sPrins%20Bernhardlaan%20328%2C%202033%20SC%20Haarlem!5e0!3m2!1snl!2snl!4v1697466464514!5m2!1snl!2snl"
                    width="800"
                    height="600"
                    style={{ border: "0" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div className="info-details">
                  <h2>Details</h2>
                  <p>Bedrooms : {house.bedrooms}</p>
                  <p>Bathrooms : {house.bathrooms}</p>
                  <p>sqm : {house.sqm}</p>
                  <div
                    style={
                      showDetails ? { display: "block" } : { display: "none" }
                    }
                  >
                    <p>Features</p>
                    {house.features.map((feature, index) => (
                      <ul key={index}>
                        <li> {feature}</li>
                      </ul>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              {houses.map((house) => (
                <SwiperSlide key={house._id}>
                  <div className="check">
                    <Link to={`/housesDetails/${house._id}`}>
                      <img
                        src={`${API_URL}/${house.images[0]}`}
                        alt="images"
                        className="swiper-img"
                        loading="lazy"
                      />
                      <div className="check2">
                        <h2>heyy</h2>
                        <p> hidfhidug</p>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DetailsPage;
