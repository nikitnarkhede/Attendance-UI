import React, { useState } from 'react';
import './Calendar.css';
import axios from 'axios'



const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceHours, setAttendanceHours] = useState({});

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

  const handleInputChange = (day, value) => {
    setAttendanceHours({
      ...attendanceHours,
      [day]: value,
    });
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
          <div key={index} className="day">
            {day ? (
              <button className="fillAttendance">
                {day}
                <input
                  className="daysInput"
                  type="text"
                  disabled={day !== currentDay}
                  onChange={e => handleInputChange(day, e.target.value)}
                />
              </button>
            ) : (
              <div className="empty"></div>
            )}
          </div>
        ))}
      </div>
      <button type="submit" onClick={() => console.log(attendanceHours)}>
        Submit
      </button>
    </div>
  );
};

export default Calendar;
