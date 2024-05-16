import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import {
  EffectCube, 
  Pagination,
  Navigation,
  FreeMode,
  Thumbs
} from "swiper/modules";

const API_URL = "http://localhost:5005/images" ;

const ModalDetailsPage = ({ house,selectedThumbnailIndex,
  toggleModal}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    console.log("house...",selectedThumbnailIndex)


  return  ReactDOM.createPortal(
    
      <div className="overlay">
      <div className="modal-content">
        <button className="close-modal" onClick={()=>toggleModal(null)}>X</button>
            <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                // loop={true}
                effect={'cube'}
                grabCursor={true}
                cubeEffect={{
                  shadow: true,
                  slideShadows: true,
                  shadowOffset: 20,
                  shadowScale: 0.94,
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                pagination={true}
                modules={[EffectCube, Pagination, FreeMode, Navigation, Thumbs]}
                className="modal-swiper-large"
                initialSlide={selectedThumbnailIndex}
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
                // loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="small-modal-swiper"
                initialSlide={selectedThumbnailIndex}
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
      </div>,
    document.getElementById("modal")
  );
};

export default ModalDetailsPage;
