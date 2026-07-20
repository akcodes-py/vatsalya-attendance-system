import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Calendar() {
  const [attendance, setAttendance] = useState({});
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year,  setYear]  = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/user-attendance/calendar/?month=${month}&year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAttendance(res.data.attendance));
  }, [month, year]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay    = new Date(year, month - 1, 1).getDay();

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
  ];

  const goBack = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const goForward = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const presentDays = Object.values(attendance).filter((s) => s === 'P').length;
  const totalDays   = Object.keys(attendance).length;

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-['Inter',sans-serif]">
      <Navbar pageTitle="My Calendar" pageIcon="📅" />

      <div className="max-w-[500px] mx-auto px-7 py-9">

        {/* Heading */}
        <div className="flex items-center justify-between mt-6 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 mb-1">Attendance Calendar</h2>
            <p className="text-sm text-gray-500 mb-0">
              {presentDays} / {totalDays} days present this month
            </p>
          </div>
          <span className="bg-[#fef08a] text-[#713f12] border border-[#fde047] text-xs px-3 py-1 rounded-full font-bold">
            {presentDays} Present
          </span>
        </div>

        <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.07)] p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              className="bg-[#f7f8fc] border-[1.5px] border-gray-200 rounded-md px-3.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:border-gray-300 transition-colors duration-200"
              onClick={goBack}
            >
              ◀
            </button>
            <span className="text-[17px] font-bold text-gray-900">
              {monthNames[month - 1]} {year}
            </span>
            <button
              className="bg-[#f7f8fc] border-[1.5px] border-gray-200 rounded-md px-3.5 py-1.5 cursor-pointer text-sm font-semibold text-gray-900 hover:bg-gray-200 hover:border-gray-300 transition-colors duration-200"
              onClick={goForward}
            >
              ▶
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1.5 mb-1.5">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-gray-500 py-1 tracking-wide uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots before first day */}
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day     = i + 1;
              const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const status  = attendance[dateStr];

              return (
                <div
                  key={day}
                  title={dateStr}
                  className={`aspect-square flex items-center justify-center rounded-md text-[13px] transition-transform duration-150 hover:scale-110 ${
                    status === 'P'
                      ? 'bg-green-600 text-white font-bold'
                      : status === 'A'
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-[#f7f8fc] text-gray-500 font-medium'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-5">
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
              <div className="w-3 h-3 rounded-sm shrink-0 bg-green-600" />
              Present
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
              <div className="w-3 h-3 rounded-sm shrink-0 bg-red-600" />
              Absent
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium">
              <div className="w-3 h-3 rounded-sm shrink-0 bg-[#f7f8fc] border border-gray-200" />
              No record
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-transparent border-[1.5px] border-gray-200 text-gray-500 px-3.5 py-1.5 rounded-md text-[13px] font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default Calendar;
