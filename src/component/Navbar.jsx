import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectloading } from "../store/auth/selectors";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../store/auth/slice";

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser);
  const isloading = useSelector(selectloading)
  // const [isloading, setIsloading] = useState(true)

  const handleLogout = ()=>{
    dispatch(logout())
    navigate("/")
  }

  useEffect(() => {
    
  }, [user]);
  
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light nav-container fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand ms-5 text-dark" href="/">
            Bietna
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav ms-auto ">
              <li className="nav-item">
                <a
                  className="nav-link active text-dark"
                  aria-current="page"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li className="nav-item ">
                <a className="nav-link text-dark" href="#">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-dark" href="#">
                  Pricing
                </a>
              </li>
              <li className="nav-item dropdown ">
                <a
                  className="nav-link dropdown-toggle text-dark"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown link
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </li>

              {user ? (
                <>
                <li className="nav-item dropdown ">
                  <a
                  className="nav-link dropdown-toggle text-dark"
                  href="#"
                  id="navbarDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className="rounded-circle"
                    style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                    src={user.profilePicture}
                    alt="profile"
                  />
                </a>
                <ul
                  className=" img-header-dropdown dropdown-menu"
                  aria-labelledby="navbarDropdownMenuLink"
                >
                  <li>
                    <a className="dropdown-item" href="/profile">
                      Profile
                    </a>
                  </li>
                  <li>
                  <button className="dropdown-item" onClick={handleLogout}>Log out</button>                  
                  </li>
                  </ul>
                </li>
                </>
              ) : (
                <li className="nav-item ">
                <a className="nav-link text-dark" href="/login">
                  Login
                </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
