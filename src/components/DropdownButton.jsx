import React, { useEffect } from 'react';
import React, {useEffect,useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import {AuthContext} from "../authentication/AuthContext.jsx"
import {isLogin} from "../authentication/ValidateToken";

const DropdownButton = () => {
  useEffect(() => {
    // Initialize Materialize JS for dropdown
    const dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns, { constrainWidth: false });
  }, []);
  const [islogin, setIslogin] = useState(isLoggedIn);
  const {userLogout,getRoles,getUsername} = useContext(AuthContext);

  const handleLogout = (path) => {
    userLogout();
    setIslogin(false);
    console.log(islogin)
    navigate(path);
}

  return (
    <div>
      <a
        className="btn dropdown-trigger"
        href="#!"
        data-target="dropdown1"
      >
        Menu
        <i className="material-icons right">arrow_drop_down</i>
      </a>

      <ul id="dropdown1" className="dropdown-content">
        <li><a href="#!">Profile</a></li>
        <li><a className="navbar-brand" style={{fontSize: 18, color: "white"}}
                                       onClick={() => handleLogout('/login')}>Logout</a></li>
      </ul>
    </div>
  );
};

export default DropdownButton;
