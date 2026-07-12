import { useState, useEffect } from 'react';
import axios from 'axios';

function Calendar() {
  const [attendance, setAttendance] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch attendance for this month
    axios.get(`http://127.0.0.1:8000/api/user-attendance/calendar/?month=${month}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setAttendance(res.data.attendance);
    });
  }, [month, year]);

  // Get number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Get what day the month starts on (0=Sun, 1=Mon...)
  const firstDay = new Date(year, month - 1, 1).getDay();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px' }}>
      <h2>My Attendance Calendar</h2>

      {/* Month navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={() => {
          if (month === 1) { setMonth(12); setYear(year - 1); }
          else setMonth(month - 1);
        }}>◀</button>

        <strong>{monthNames[month - 1]} {year}</strong>

        <button onClick={() => {
          if (month === 12) { setMonth(1); setYear(year + 1); }
          else setMonth(month + 1);
        }}>▶</button>
      </div>

      {/* Day labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '4px' }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} style={{ fontWeight: 'bold', fontSize: '12px' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
        {/* Empty boxes before first day */}
        {Array(firstDay).fill(null).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day boxes */}
        {Array(daysInMonth).fill(null).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const status = attendance[dateStr];

          let bgColor = '#f0f0f0';  // no record
          if (status === 'P') bgColor = '#4CAF50';  // green = present
          if (status === 'A') bgColor = '#f44336';  // red = absent

          return (
            <div
              key={day}
              style={{
                background: bgColor,
                color: status ? 'white' : 'black',
                padding: '10px 0',
                textAlign: 'center',
                borderRadius: '4px',
                fontWeight: 'bold',
              }}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
        <span><span style={{ background: '#4CAF50', padding: '2px 8px', color: 'white' }}>■</span> Present</span>
        <span><span style={{ background: '#f44336', padding: '2px 8px', color: 'white' }}>■</span> Absent</span>
        <span><span style={{ background: '#f0f0f0', padding: '2px 8px' }}>■</span> No record</span>
      </div>

      <br />
      <button onClick={() => window.history.back()} style={{ cursor: 'pointer' }}>← Back</button>
    </div>
  );
}

export default Calendar;
