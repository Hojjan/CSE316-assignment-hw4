import React from "react";
import '../cssPages/navbar.css'
import { Link, useLocation } from "react-router-dom";

function Navbar(){
  const location = useLocation();
  const isSpecialPage = location.pathname === "/signin";

  return(
    <nav>
      {/* Changed all <a href=> to <Link> */}
        <ul className={`${isSpecialPage ? "special-menu" : ""}`}>
          {!isSpecialPage && (
            <li className="home-button">
              <Link to="/homepage">
                <svg xmlns="http://www.w3.org/2000/svg" height="35" viewBox="0 -960 960 960" width="35" fill="#5f6368">
                  <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                </svg>
              </Link>
            </li>
          )}

          {/* codes for Facility List, Reservation, User menus on nav bar */}
          <div className="center-menu">
            <li className="hideOnMobile">
              <Link to="/facilityList"><p>Facility List</p></Link>
            </li>
            <li className="hideOnMobile">
                <Link to="/reservation"><p>Reservation</p></Link>
            </li>
            <li className="hideOnMobile">
                <Link to="#" className="user">
                  <p>User</p>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
                      <path d="M480-360 280-560h400L480-360Z" />
                    </svg>
                </Link>
                <ul className="dropdown-content">
                  <Link to="/userInfo">My Information</Link>
                  <Link to="/reservationHistory">Reservation History</Link>
                </ul>
            </li>
            
            <li className="hideOnMobile">
              <Link to="/signin"><p>Sign in</p></Link>
            </li>
          </div>

          {/* Hamburger menu button appears */}
          {!isSpecialPage && (
            <li className="menu-button" onClick={showHamburger}>
              <Link to = "#">
                <svg xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 -960 960 960" width="26" fill="#5f6368">
                  <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
                </svg>
              </Link>
            </li>
          )}

          {!isSpecialPage && (
            <li className="signin-button hideOnMobile">
              <Link to = "signin">
                <button className="signin">Sign in</button>
              </Link>
            </li> 
          )}
        </ul>

        {/* hamburger menu details */}
        <ul className="hamburger">
          <li>
            <Link to="/facilityList">Facility List</Link>
          </li>
          <li>
            <Link to="/reservation">Facility Reservation</Link>
          </li>
          <li>
            <Link to="#">
              User
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M480-360 280-560h400L480-360Z" /></svg>
            </Link>
            <ul className="dropdown-content">
              <Link to="/userInfo">My Information</Link>
              <Link to="/reservationHistory">Reservation History</Link>
            </ul>
          </li>
        </ul>
    </nav>
  );
}

function showHamburger(){
  const hamburger = document.querySelector('.hamburger');
  const bodyContent = document.querySelector('body');
  
  /* Pushing every contents down when Hamburger menu expanded */
  if (hamburger.style.display === "flex") {
      hamburger.style.display = "none";
      bodyContent.style.marginTop = "100px";
    } else {
      hamburger.style.display = "flex";
      bodyContent.style.marginTop = "250px";
    }
}

export default Navbar;