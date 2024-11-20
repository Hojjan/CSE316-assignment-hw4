import React from "react";
import '../cssPages/homepage.css';



function Home(){
  return(
    <div className="contents">
        <li className='discList' id='subtitle'>Facility List</li>
        <li></li>
        <div className="contexts">
          <p>Show list of facilities.</p>
          <p>name, description, location, min capacity, max capacity, image, onlySUNY, available day of the week</p>
        </div>        
        <li className='discList' id='subtitle'>Facility Reservation</li>
        <div className="contexts">
          <p>1. Reservation Date should be the date after today</p>
          <p>2. The number of users should be between the maximum number of people and the minimum number of people.</p>
          <p>3. If the facility is available only for SUNY Korea, user should be in SUNY Korea</p>
          <p>4. The reservation date must be made on the available day of the week</p>
          <p>5. If someone booked the facility on that date, no one else can book the facility on that date.</p>
          <p>If all conditions are met, data is stored in the database.</p>
        
        </div>
        <li className='discList' id='subtitle'>User</li>
      </div>
  );
}

export default Home;