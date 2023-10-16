import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchDetailsPage } from "../store/houseDetails/thunks";
import { selectHouseDetail } from "../store/houseDetails/selectors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown, faAnglesUp, faBathtub, faBed, faCaretDown, faRuler, faRulerCombined } from "@fortawesome/free-solid-svg-icons";


function DetailsPage() {
  const house = useSelector(selectHouseDetail);
  const dispatch = useDispatch();
  const { houseId } = useParams();
  const [slideIndex, setSlideIndex] = useState(1);
  const [showDetails, setShowDetails] = useState(false)

  // const containerStyles = {
  //   width: "500px",
  //   height: '200px',
  //   overflowY: 'auto',
  //   border: '1px solid #ccc',
  //   padding: '10px',
  // };

  // const plusSlides = (n) => {
  //   showSlides(slideIndex + n);
  // };

  // const currentSlide = (n) => {
  //   showSlides(n);
  // };

  // const showSlides = (n) => {
  //   const slides = document.getElementsByClassName("mySlides");
  //   const dots = document.getElementsByClassName("demo");
  //   // const captionText = document.getElementById("caption");
  //   console.log("slides......", slides)
  //   if (n > slides.length) {
  //     setSlideIndex(1);
  //   }
  //   if (n < 1) {
  //     setSlideIndex(slides.length);
  //   }

  //   for (let i = 0; i < slides.length; i++) {
  //    // slides[i].style.display = "none";
  //       slides[i].style.display = i + 1 === slideIndex ? "block" : "none";
  //       console.log("slides......",slides[i])
  //       console.log("slideIndex......",slideIndex)
  //   }
  //   for (let i = 0; i < dots.length; i++) {
  //     const className = dots[i].className = dots[i].className.replace("active", "");
  //     dots[i].className = i + 1 === slideIndex ? `${className} active` : className;
  //   }
  //  // slides[slideIndex - 1].style.display = "block";
  //  // dots[slideIndex - 1].className += " active";
  //   // captionText.innerHTML = dots[slideIndex - 1].alt;
  // };

 const detailsToggle = () =>{
  setShowDetails(!showDetails)
 }

  useEffect(() => {
    dispatch(fetchDetailsPage(houseId));
  }, [dispatch, houseId]);

  // useEffect(() => {
  //   showSlides(slideIndex);
  // }, [slideIndex]);

  return (
    <div className="details-container">
      {house ? (
        <div className="details-wrapper">
          <div className="house-details">
            <div className="house-details-img">
              {house.images.map((image, index) =>
    <div className="carousel-item active" key={index}>
      <img src={image} width= "800px" height="592px" className="d-block" alt="..."/>
    </div>
)}
              {/* <div className="container">
                {house.images.map((image, index) => (
                  <div key={index} className="mySlides">
                    <div className="numbertext">
                      {index + 1} / {house.images.length}
                    </div>
                    <img
                      src={image}
                      style={{ width: "100%"}}
                      alt={`Image ${index + 1}`}
                    />
                  </div>
                ))}

                <a className="prev" onClick={() => plusSlides(-1)}>
                  ❮
                </a>
                <a className="next" onClick={() => plusSlides(1)}>
                  ❯
                </a>

                <div className="caption-container">
                  <p id="caption"></p>
                </div>

                <div className="row">
                  {house.images.map((image, index) => (
                    <div key={index} className="column">
                      <img
                        className={`demo cursor ${
                          slideIndex === index + 1 ? "active" : ""
                        }`}
                        src={image}
                        style={{ width: "100%"}}
                        onClick={() => currentSlide(index + 1)}
                        alt={`Image ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
            <div className="house-details-box" >
              <div className="house-address-price">
                <h1>
                  {house.address}
                </h1>
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
                <p className="rooms-text"> {<FontAwesomeIcon icon={faRulerCombined} />} sqm: {house.sqm}</p>
                </div>
              </div>
              <button>Contact Us </button>
            </div>
          </div>
          <div className="general-house-info">
          <div className="general-house-title">
            <h1>house details</h1>
            <button className="button-hide-show" onClick={detailsToggle}>{showDetails? <FontAwesomeIcon icon={faAnglesDown} />:<FontAwesomeIcon icon={faAnglesUp} />}</button>
          </div>
            <div className="house-details-dropdown" style={showDetails? {display: "block"}: {display: "none"}}>
              <div className="house-info">
                <div className="map-info">
                  <h1>Map</h1>
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2435.837259239149!2d4.653629776675463!3d52.373370847075215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5ef5f774567c5%3A0xb8ba8b9c0080cc53!2sPrins%20Bernhardlaan%20328%2C%202033%20SC%20Haarlem!5e0!3m2!1snl!2snl!4v1697466464514!5m2!1snl!2snl" width="800" height="600" style={{border:"0"}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className="info-details">
                  <h2>Details</h2>
                  <p>Bedrooms : {house.bedrooms}</p>
                  <p>Bathrooms : {house.bathrooms}</p>
                  <p>sqm : {house.sqm}</p>
                  <div style={showDetails ? {display:"block"} : {display:"none"}}>
                    <p>Features</p>
                    { house.features.map((feature, index)=>
                    
                    <ul key={index}>
                      <li > {feature}</li>
                      </ul>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper">
          swiper
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DetailsPage;
