import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import DOMPurify from "dompurify"; 
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import {
  Pagination,
  Navigation,
  FreeMode,
  Thumbs
} from "swiper/modules";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const ModalDetailsPage = ({ house,selectedThumbnailIndex,
  toggleModal}) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const sanitizedImages = house.images.map(image =>
      DOMPurify.sanitize(image, { ALLOWED_URI_REGEXP: /^(?:(?:https?|data):)/i })
    );

  return  ReactDOM.createPortal(

      <div className="overlay">
      <div className="modal-content">
        <button className="close-modal" onClick={()=>toggleModal(null)}><FontAwesomeIcon icon={faCircleXmark} /></button>
            <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                pagination={true}
                modules={[Pagination, FreeMode, Navigation, Thumbs]}
                className="modal-swiper-large"
                initialSlide={selectedThumbnailIndex}
              >
                {sanitizedImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Image-index ${index}`}
                      loading="lazy"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="small-modal-swiper"
                initialSlide={selectedThumbnailIndex}
              >
                {sanitizedImages.map((image, index) => (
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
      </div>,
    document.getElementById("modal")
  );
};

export default ModalDetailsPage;
