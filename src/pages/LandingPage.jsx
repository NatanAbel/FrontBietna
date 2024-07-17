import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchedHouses } from "../store/houses/thunks";
import { selecthouses } from "../store/houses/selectors";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Search from "../component/Search";

import { Swiper, SwiperSlide } from "swiper/react";


// import required modules
import {
  EffectCoverflow,
  Pagination,
  Navigation,
  FreeMode,
  Thumbs,
  EffectCube,
} from "swiper/modules";
// import HouseList from "./HouseList";

const API_URL = "http://localhost:5005/images";

function LandingPage({forRent,setForRent,forSale,setForSale, handleAvailabilityClick}) {
  const dispatch = useDispatch();
  const house = useSelector(selecthouses);
  const [search, setSearch] = useState("");
  // const [forSale, setForSale] = useState(false);
  // const [forRent, setForRent] = useState(false);
  const [landingResult, setLandingResult] = useState([]);
  const { allHouses } = house;
  const navigate = useNavigate()
  const location = useLocation().pathname
  // const searchFilter = search && houses.filter((house) => {
  //   return search === ""
  //     ? true
  //     :  house.address.toLowerCase().includes(search.toLowerCase());
  // });
  
  // const handleSubmit = (e) => {
  //   e.preventDefault();  
  //       console.log("searchFilter..", searchFilter)
  //   if(location === "/" ){
  //     searchFilter.length > 0 ? searchFilter[0] : null;
  //     navigate(`/houses`)
  //   }     
  // };

  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   if (search.length > 0) {
  //     const searchFilter = search
  //       ? houses.filter((house) =>
  //           house.address.toLowerCase().includes(search.toLowerCase())
  //         )
  //       : [];
  //       console.log("searchFilter....llll", searchFilter)
  //     // Navigate to HouseList and pass search input and results as state
  //     // navigate("/houses/allHouses", { state: { search, results: searchFilter } });
  //   }
  // };

 
  
  const handleSearch = (searchInput, searchResults) => {
    // setSearch(searchInput);
    
    // Navigate to the HouseList page with the search input
    navigate("/houses/allHouses", { state: { search: searchInput, results: searchResults} });
  };
  // console.log("search......",search)
  // useEffect(() => {
  //   // dispatch(fetchedHouses(1,10));
  // }, [dispatch]);

  return (
    <div className="landing-container">
      <header className="header">
        <div className="header-left">
          <h1>Welcome to Bietna</h1>
          {/* <div className="header-button">
              <a className="my-button">
                Rent
              </a>
              <a className="my-button">
                Sell
              </a>
          </div> */}
          <Search houses={allHouses} search={search} setSearch={setSearch} handleSearch={handleSearch} forRent ={forRent} setForRent={setForRent} forSale={forSale} setForSale={setForSale}/>
        </div>
      </header>
      <main className="main">
        <div className="slide-listing">
          <div className="main-text">
            <h2>Houses Ready For Sell & Rent </h2>
          </div>
          <div className="landing-gallery-wrapper">
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
              
              
                {allHouses.slice(0, 8).map((house) => (
                  <SwiperSlide key={house._id}>
                    <div className="details-card-wrapper">
                      <Link to={`/housesDetails/${house._id}`}>
                        <img
                          src={`${API_URL}/${house.images[0]}`}
                          alt="images"
                          className="swiper-img"
                          loading="lazy"
                        />
                        <div className="details-card">
                          <div>
                            <h2>{house.address}</h2>
                            <p> ${house.availability.forRent ? house.rentalPrice : house.price}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
            
            </Swiper>
          </div>
          </div>
          <Link to="houses/allHouses" className="View-all-btn">
            View All
          </Link>
        </div>
        <div className="cards-wrapper">
          <div className="cards">
            <div className="card-buy" onClick={() => handleAvailabilityClick('forSale')}>
              {/* <Link to="/houses/buy" className="cards-link"> */}
                <h4>House To Buy</h4>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dolore amet eius sequi inventore. Neque iure quod illum
                  officia cum est nesciunt eum rerum! Aliquid, magnam.
                </p>
              {/* </Link> */}
            </div>
            <div className="card-sell">
              <Link className="cards-link">
                <h4>House To Sell</h4>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dolore amet eius sequi inventore. Neque iure quod illum
                  officia cum est nesciunt eum rerum! Aliquid, magnam.
                </p>
              </Link>
            </div>
            <div className="card-rent" onClick={() => handleAvailabilityClick('forRent')}>
              {/* <Link to="/houses/rent" className="cards-link"> */}
                <h4>House To Rent</h4>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dolore amet eius sequi inventore. Neque iure quod illum
                  officia cum est nesciunt eum rerum! Aliquid, magnam.
                </p>
              {/* </Link> */}
            </div>
          </div>
        </div>
        <div className="main-contact-us">
          <div className="contact-us-info">
            <h3>Contact Us</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
              veniam animi, labore delectus aspernatur autem perspiciatis neque
              perferendis culpa quisquam dolores inventore provident, doloremque
              incidunt.
            </p>
          </div>
          <div className="contact-us-img">
            <img
              src="public/images/contact-us-img.jpeg"
              alt="contact us image"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
