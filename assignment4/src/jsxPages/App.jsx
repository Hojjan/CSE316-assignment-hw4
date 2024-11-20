import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '../cssPages/App.css'

import Navbar from './navbar';
import Home from './homepage';
import FacilityList from "./facilityList";
import Reservation from './reservation';
import Userinfo from './userInfo';
import ReservationHistory from './reservationHistory'; 

function App() {
  return (
    <Router>
      <Navbar />
      {/* Used Route to apply navigation bar in every pages in common 
      path value is for additional info on the right side of server address*/}
      <Routes>
        <Route path="/" element={<Navigate to="/homepage" replace />} /> 
        <Route path="/homepage" element={<Home />} />
        <Route path="/facilityList" element={<FacilityList />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/userInfo" element={<Userinfo />} />
        <Route path="/reservationHistory" element={<ReservationHistory />} />
        
      </Routes>

    </Router>
  );
}



export default App;
