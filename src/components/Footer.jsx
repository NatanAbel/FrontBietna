import { Link } from "react-router-dom"
import "./Footer.css"

function Footer({handleAvailabilityClick}) {
  return (
    <footer className="footer">
        <div className="footer-container">
          <div className="footer-wrapper">
            <div className="footer-links">
              <h3>Quick Links</h3>
              <p onClick={()=>handleAvailabilityClick("forSale")}><Link to="/houses/buy">Buy</Link></p>
              <Link to="/#"><p>Sell</p></Link>
              <p onClick={()=>handleAvailabilityClick("forRent")}><Link to="/houses/rent">Rent</Link></p>
            </div>
            <div className="footer-links">
              <h3>Info</h3>
              <p><Link to="/#">About Us</Link></p>
              <p><Link to="/#">Contact Us</Link></p>
              <p><Link to="/#">Features</Link></p>
            </div>
            <div className="footer-links">
              <h3>Social Media</h3>
              <p><Link>facebook</Link></p>
              <p><Link>instagram</Link></p>
              <p><Link>twitter</Link></p>
            </div>
          </div>
          <hr />
          <div className="footer-wrapper-below">
            <div className="footer-copyright">
              <p>
                @{new Date().getFullYear()} Bietna Real Estate. All right
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer