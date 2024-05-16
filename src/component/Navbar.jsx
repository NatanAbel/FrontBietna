
function Navbar() {
  return (
    <div className="container nav-container ">
        <nav className="navbar navbar-expand-lg navbar-light bg-dark nav fixed-top">
          <div className="container-fluid">
        <a className="navbar-brand ms-5 text-light" href="/">Bietna</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto ">
            <li className="nav-item">
              <a className="nav-link active text-light" aria-current="page" href="#">Home</a>
            </li>
            <li className="nav-item ">
              <a className="nav-link text-light" href="#">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-light" href="#">Pricing</a>
            </li>
            <li className="nav-item dropdown ">
              <a className="nav-link dropdown-toggle text-light" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown link
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>
        </div>
          </div>
        </nav>
    </div>
  )
}

export default Navbar