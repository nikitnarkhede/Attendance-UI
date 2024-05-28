import React, { useState, useEffect, useRef } from 'react';
import './Calendar.css'; // Make sure your CSS file is correctly imported

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const [fetchAttendanceDataForEmployee, setFetchAttendanceDataForEmployee] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceHours, setAttendanceHours] = useState({});
  const [todayHours, settodayHours] = useState(0);
  const prevAttendanceHoursRef = useRef();

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeRef: 'EMP123' })
    };
    fetch('http://localhost:8081/attendance/getAttendanceForEmployee', requestOptions)
      .then(response => response.json())
      .then(data => {
        const attendanceList = data.getAttendanceResponseList || [];
        const hoursData = {};
        attendanceList.forEach(entry => {
          const date = new Date(entry.date);
          const day = date.getDate();
          hoursData[day] = entry.hours;
        });
        setFetchAttendanceDataForEmployee(attendanceList);
        setAttendanceHours(hoursData);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  useEffect(() => {
    prevAttendanceHoursRef.current = attendanceHours;
  }, [attendanceHours]);

  const prevAttendanceHours = prevAttendanceHoursRef.current;

  const handleInputChange = (day, value) => {
    setAttendanceHours(prevAttendanceHours => ({
      ...prevAttendanceHours,
      [day]: value,
    }));
  };

  const handleAfterClickingSubmit = (event) => {
    const inputValue = parseInt(event.target.value); // Parse input value to integer
    const todaysday = new Date(); 
    console.log(attendanceHours[todaysday.getDate()]);
    settodayHours(prevtodayHours => prevtodayHours+ inputValue)
    
    // Calculate total hours by summing all values in attendanceHours
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeRef: 'EMP123',"date":new Date(), "hours": attendanceHours[todaysday.getDate()], "task":"Prod Issue"})
    };
    fetch('http://localhost:8081/attendance/fillAttendace', requestOptions)
      .then(response => response.json())
      .then(data => {
       alert(data.status)
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  ;
  };

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startDayOfWeek = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  const currentDay = isCurrentMonth ? today.getDate() : null;

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push('');
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="calendar">
      <div className="header">
        <button onClick={previousMonth}>&lt;</button>
        <span>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </span>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="days-of-week">
        {daysOfWeek.map(day => (
          <div key={day} className="day-of-week">{day}</div>
        ))}
      </div>
      <div className="days">
        {days.map((day, index) => (
          <div key={index} className={`day ${day === '' ? 'empty' : ''}`}>
            {day ? (
              <div className="fillAttendance">
                {day}
                <input
                  className="daysInput"
                  type="text"
                  value={attendanceHours[day] || 0}
                  disabled={day !== currentDay}
                  onChange={e => handleInputChange(day, e.target.value)}
                />
              </div>
            ) : (
              <div className="empty"></div>
            )}
          </div>
        ))}
      </div>
      <button type="submit" onClick={ handleAfterClickingSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Calendar;
