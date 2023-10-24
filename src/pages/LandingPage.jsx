import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchedHouses } from "../store/houses/thunks";
import { selecthouses } from "../store/houses/selectors";
import { Link } from "react-router-dom";
// import Search from "../component/Search";

function LandingPage() {
  const dispatch = useDispatch();
  const house = useSelector(selecthouses);
  const [search, setSearch] = useState("");
  const { houses } = house;

  const searchFilter = houses.filter((house) => {
    return search === ""
      ? true
      : house.address.toLowerCase().includes(search.toLowerCase());
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    dispatch(fetchedHouses);
  }, [dispatch]);

  return (
    <div className="landing-container">
      <header className="header">
        <div className="header-left">
          <h1>Welcome to Bietna</h1>
          {/* <Search houses={houses} search={search} setSearch={setSearch} handleSubmit={handleSubmit} searchFilter={searchFilter}/> */}
        </div>
      </header>
      <main className="main">
        <div className="slide-listing">
          <div className="main-text">
            <h2>Buildings Ready For Sell & Rent </h2>
          </div>
          <div className="landing-gallery-wrapper">
            <div className="landing-gallery-text">
              <h2>Buildings Ready For Sell & Rent </h2>
            </div>
            <div className="landing-gallery">
              {houses ? (
                houses.map((house) => (
                  <div className="landing-gallery_item" key={house._id}>
                    <img
                      src={house.images[0]}
                      alt=""
                      className="landing-gallery_image"
                    />
                  </div>
                ))
              ) : (
                <p>loading...</p>
              )}
            </div>
          </div>
          <Link to="houses/allHouses" className="View-all-btn">
            View All
          </Link>
        </div>
        <div className="cards-wrapper">
          <div className="cards">
            <div className="card-buy">
              <Link to="/houses/buy" className="cards-link">
                <h4>House To Buy</h4>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dolore amet eius sequi inventore. Neque iure quod illum
                  officia cum est nesciunt eum rerum! Aliquid, magnam.
                </p>
              </Link>
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
            <div className="card-rent">
              <Link to="/houses/rent" className="cards-link">
                <h4>House To Rent</h4>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Dolore amet eius sequi inventore. Neque iure quod illum
                  officia cum est nesciunt eum rerum! Aliquid, magnam.
                </p>
              </Link>
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
