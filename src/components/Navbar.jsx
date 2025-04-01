import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/auth/selectors";
import { useEffect } from "react";
import {  useLocation, useNavigate } from "react-router-dom";
import { fetchLogOut } from "../store/auth/thunks";

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser);

  const handleLogout = ()=>{
    dispatch(fetchLogOut())
    navigate("/")
  }

  useEffect(() => {

  }, [user]);

  return (
    <div className="container navbar-wrapper ">
      <nav className="navbar navbar-expand-lg navbar-light nav-container fixed-top">
        <div className="container-fluid px-2">
          <a className="navbar-brand text-dark" href="/">
            Bietna
          </a>
          <button
            className="navbar-toggler px-0"
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
            <ul className="navbar-nav ms-auto">
              <li className="nav-item  d-flex align-items-center nav-hover">
                <a
                  className="nav-link active text-dark "
                  aria-current="page"
                  href="/"
                >
                  Home
                </a>
              </li>
              <li className="nav-item  d-flex align-items-center nav-hover">
                <a
                  className="nav-link active text-dark "
                  aria-current="page"
                  href="/houses/allHouses"
                >
                  Houses
                </a>
              </li>
              {user ? (
                <>
                <li className="nav-item  d-flex align-items-center nav-hover">
                <a
                  className="nav-link active text-dark"
                  aria-current="page"
                  href="/house/new"
                >
                  New House
                </a>
              </li>
                <li className="nav-item dropdown d-flex align-items-center position-relative ">
                  <a
                  className="nav-link dropdown-toggle text-dark "
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
                    loading="lazy"
                    alt="profile"
                  />
                </a>
                <ul
                  className=" img-header-dropdown dropdown-menu position-absolute "
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
                <>
                <li className="nav-item nav-hover">
                <a className="nav-link text-dark" href="/login">
                  New House
                </a>
                </li>
                <li className="nav-item nav-hover">
                <a className="nav-link text-dark" href="/login">
                  Login
                </a>
                </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
