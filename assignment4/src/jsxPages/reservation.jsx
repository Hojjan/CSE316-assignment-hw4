import React, { useState, useEffect } from "react";
import '../cssPages/reservation.css'
import axios from 'axios';


const calculateDayOfWeek = (day, month, year) => {
  if (month === 1) { //for January, set month to 13 and subtract 1 from year
      month = 13;
      year -= 1;
  } else if (month === 2) { //for January, set month to 14 and subtract 2 from year
      month = 14;
      year -= 1;
  }

  const q = day;
  const m = month;
  const k = year % 100; // last two digits of the year
  const j = Math.floor(year / 100); // first two digits of the year

  const d = (q + Math.floor(13 * (m + 1) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + (5 * j)) % 7;
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  return days[d];
};

function Reservation(){
    const [selectedFacility, setSelectedFacility] = useState('Gym'); //default should be Gym

    const [numPeople, setNumPeople] = useState(''); //use 4 states for getting inputs from reservation
    const [date, setDate] = useState('');
    const [suny, setSuny] = useState('SUNY');
    const [purpose, setPurpose] = useState('');
    const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/facilities')
      .then((response) => {setFacilities(response.data); })
      .catch((error) => {console.error('Error fetching facility data:', error);});
  }, []);

    const handleFacilityChange = (event) => {
      setSelectedFacility(event.target.value);
    };

    const handleSubmit = async(e) => {
      e.preventDefault();

      // making 2 variables to check whether there are already reserved facilities
      const response = await axios.get('http://localhost:3001/api/reservation');
      const strdReserv = response.data;


      const slctedFacData = facilities.find(facility => facility.facility_name === selectedFacility);

      const location = slctedFacData.location;
      const src = slctedFacData.img_src;

      const minPar = slctedFacData.min_capacity;
      const maxPar = slctedFacData.max_capacity;

      const inputDate = new Date(date); // Date input
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Checking if the input is in right form
      if (isNaN(numPeople) || numPeople.trim() === "") {
        alert('Error: no input or wrong type of input');
        return;
      }

      // Checking capacity & participant numbers
      const numVPeople = parseInt(numPeople);
      if (numVPeople < minPar || numVPeople > maxPar) {
          alert('Capacity error: Invalid participant count.');
          return;
      }


      // If date input is past, alert error
      if (inputDate < today) {
          alert('You cannot make a reservation for a past date.');
          return;
      }
      
      const year = inputDate.getFullYear();
      const month = inputDate.getMonth() + 1;
      const day = inputDate.getDate();

      const dayOfWeek = calculateDayOfWeek(day, month, year);
      
      // Checking available day
      if (!slctedFacData.available_days.includes(dayOfWeek)) {
          alert('Day error: Invalid day of the week');
          return;
      }

      // Checking only for SUNY or Not
      if (slctedFacData.suny_flag === true && suny === 'Non-SUNY') {
        alert(`This facility is available only for SUNY Korea members.`);
        return;
      }



      // Checking if there is a reservation for same facility
      if (strdReserv.find(res => res.reservation_name === selectedFacility)) {
          alert('You already have a reservation for this facility.');
          return;
      }

      // Checking if there is another reservation for same date
      if (strdReserv.find(res => res.reservation_date === date)) {
          alert('You already have a reservation for another facility on same date.');
          return;
      }



      const newReservation = { facility: selectedFacility, date, numPeople, suny, purpose, src, location};


      // data posting in the DB
      axios.post('http://localhost:3001/api/reservation', newReservation)
      .then((response) => {
        alert(response.data.message); // 'Reservation successful!' message alert
      })
      .catch((error) => {
        alert('Failed to save reservation. Please try again.');
      });
    };
  
    // selecting proper image for a facility
    const slctedFacData = facilities.find(facility => facility.facility_name === selectedFacility);

    return(
    
    <div className="wholeReservation"> 
      <div className="imgWdesc">
        <div className="menu-container">
          <select id="facility-select" onChange={handleFacilityChange}>
            {facilities.map((facility) => (
              <option key={facility.facility_name} value={facility.facility_name}>
                {facility.facility_name}
              </option>
            ))}
            </select>
        </div>

        <div>
          {slctedFacData && (
            <div className="imageList">
                <img src={slctedFacData.img_src} alt={slctedFacData.facility_name}  />
                <div className="facility-details">
                    <h2>{slctedFacData.facility_name}</h2>
                    <p>{slctedFacData.facility_desc}</p>
                    <p><img src={'/calendar.png'} alt={'calendar icon'} />{slctedFacData.available_days}</p>
                    <p><img src={'/location.png'} alt={'location icon'} />{slctedFacData.location}</p>
                    <p><img src={'/people.png'} alt={'people icon'} />{slctedFacData.min_capacity}-{slctedFacData.max_capacity}</p>
                    <p><img src={'/exclamation.png'} alt={'availiablity icon'} />{slctedFacData.suny_flag ? 'Only available for SUNY' : 'Available to All'}</p>

                </div>
            </div>
          )}
          
        </div>
      </div>

      <div className="context">
        <div className="datePickerContainer">
          <p>Date to be Used:</p>
          <input type="date" id="datePicker" value={date} onChange={(e) => setDate(e.target.value)}/>
        </div>

        <div className="peopleContainer">
          <p>Number of People:</p>
          <input type="text" className="people" value={numPeople} onChange={(e) => setNumPeople(e.target.value)}/>
        </div>

        <div className="buttonContainer">
          <div className="radio-options">
            <p><input type="radio" name="suny" value="yes" checked={suny === 'SUNY'} onChange={() => setSuny('SUNY')}/>SUNY Korea</p>
            <p><input type="radio" name="suny" value="no" checked={suny === 'Non-SUNY'} onChange={() => setSuny('Non-SUNY')}/>Non-SUNY Korea</p>
          </div>
        </div>

        <div className="text-container">
          <p>Purpose of Use:</p>
          <textarea id="user-input" onChange={(e) => setPurpose(e.target.value)}></textarea>
        </div>
        
        <button type="submit" onClick={handleSubmit}>submit</button>
      </div>

    </div>

    
    );

    
}


export default Reservation;