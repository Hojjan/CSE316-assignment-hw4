import React from "react";
import '../cssPages/homepage.css';



function Home(){
  return(
    <div className="contents">
        <li className='discList' id='subtitle'>Facility Reservation</li>
        <li className='circleList'>Facility List</li>
        <div className="contexts">
          <p>1. Reservation Data should be the date after today</p>
          <p>2. The number of users should be between the maximum number of people and the minimum number of people.</p>
          <p>3. If the failicy is available only for SUNY Korea, user should be in SUNY Korea</p>
          <p>4. The reservation date must be made on the available day of the week</p>
          <p>5. The same person cannot book another facility on the same date.</p>
          <p id='moreIndent'>If all condition are met, data is stored in local storage.</p>
        </div>        
        <li className='circleList' id='subtitle'>User Information</li>
        <div className="contexts">
          <p>1. user profile, user email, user password, user name</p>
          <p>2. All other details can be modified except for the user email.</p>
          <p>3. If the user profile is changed, the image in the navbar will also change.</p>
        </div>
        <li className='circleList' id='subtitle'>Reservation History</li>
        <div id='noIndent'>
          <p>Load the reservation data stored in the local storage.</p>
          <p>reservation id, facility name, purpose, peopleNum, isSUNY, booker name, date</p>
          <p>Can cancel reservation</p>
        </div>
      </div>
  );
}

export default Home;