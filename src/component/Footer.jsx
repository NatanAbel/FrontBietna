import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer >
        <div className="footer-container">
          <div className="footer-wrapper">
            <div className="footer-links">
              <h3>Quick Links</h3>
              <Link to="/#"><p>Buy</p></Link>
              <Link to="/#"><p>Sell</p></Link>
              <Link to="/#"><p>Rent</p></Link>
            </div>
            <div className="footer-links">
              <h3>Info</h3>
              <Link to="/#"><p>About Us</p></Link>
              <Link to="/#"><p>Contact Us</p></Link>
              <Link to="/#"><p>Features</p></Link>
            </div>
            <div className="footer-links">
              <h3>Social Media</h3>
              <Link><p>facebook</p></Link>
              <Link><p>instagram</p></Link>
              <Link><p>twitter</p></Link>
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