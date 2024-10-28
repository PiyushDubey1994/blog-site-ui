import logo from "../assets/image/logo-no-background.png";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../authentication/AuthContext.jsx";
import { isLogin } from "../authentication/ValidateToken";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css/dist/js/materialize.min.js";

const Header = () => {
  useEffect(() => {
    // Initialize Materialize JS for dropdown
    const dropdowns = document.querySelectorAll(".dropdown-trigger");
    M.Dropdown.init(dropdowns, { constrainWidth: false });
  }, []);

  const isLoggedIn = isLogin();
  const [islogin, setIslogin] = useState(isLoggedIn);
  const { getRoles,userLogout, getUsername } = useContext(AuthContext);
  const navigate = useNavigate();

  const hasAdminRole = () => {  // Check if 'admin' is in the roles array
    const roles = getRoles();
    console.log(roles);
    return roles && roles.includes('ROLE_ADMIN');
};

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = (path) => {
    userLogout();
    setIslogin(false);
    navigate(path);
  };

  return (
    <>
      <div className="LoginForm">
        <div className="row" style={{ paddingBottom: 110 }}>
          <nav
            className="nav-wrapper navbar navbar-expand-sm"
            style={{
              position: "fixed",
              left: 0,
              height: 60,
              width: "100%",
              zIndex: 1000,
              backgroundColor: "#004d40", // Header background color
            }}
          >
            <div className="container-fluid">
              <a className="navbar-brand">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: 50, width: "120px" }}
                />
              </a>

              {islogin && (
                <div className="collapse navbar-collapse" id="mynavbar">
                  <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        style={{ fontSize: 18, color: "wheat" }}
                        onClick={() => handleNavigation("blogs")}
                      >
                        Blogs
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        style={{ fontSize: 18, color: "wheat" }}
                        onClick={() => handleNavigation("postblog")}
                      >
                        Post Blog
                      </a>
                    </li>
                    {hasAdminRole() &&( <li className="nav-item">
                      <a
                        className="nav-link"
                        style={{ fontSize: 18, color: "wheat" }}
                        onClick={() => handleNavigation("userList")}
                      >
                        View User
                      </a>
                    </li>)}
                   
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        style={{ fontSize: 18, color: "wheat" }}
                        onClick={() => handleNavigation("myProfile")}
                      >
                        Profile
                      </a>
                    </li>
                  </ul>
                  <form className="d-flex">
                    <div>
                      {/* Increased font size for username and changed button color */}
                      <a
                        className=" dropdown-trigger"
                        href="#!"
                        data-target="dropdown1"
                        style={{
                          backgroundColor: "#004d40", // Match button color with header
                          color: "white",
                          fontSize: "20px", // Increased font size for username
                        }}
                      >
                        Welcome : {getUsername()}
                        <i className="material-icons right">arrow_drop_down</i>
                      </a>

                      <ul id="dropdown1" className="dropdown-content">
                        <li>
                          <a href="#!">Profile</a>
                        </li>
                        <li>
                          <a className="navbar-brand" style={{ fontSize: 18, color: "black" }}   onClick={() => handleLogout("/login")}>
                            Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
