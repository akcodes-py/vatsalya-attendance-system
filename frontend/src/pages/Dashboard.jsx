import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Dashboard() {
  const navigate  = useNavigate();
  const role      = localStorage.getItem('role')     || 'user';
  const username  = localStorage.getItem('username') || 'User';

  const avatarLetter = username ? username[0].toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-['Inter',sans-serif]">
      <Navbar pageTitle="Dashboard" pageIcon="📊" />

      <div className="max-w-[500px] mx-auto px-7 py-9">

        {/* Welcome header */}
        <div className="bg-white border border-gray-200 rounded-[14px] shadow-[0_1px_4px_rgba(0,0,0,0.07)] p-6 flex items-center gap-4.5 mb-2">
          <div className="w-[54px] h-[54px] rounded-full bg-gradient-to-br from-[#3d28b0] to-purple-600 text-white flex items-center justify-center text-[22px] font-extrabold shrink-0 shadow-md shadow-[#3d28b0]/25">
            {avatarLetter}
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 leading-tight">Welcome, {username}</p>
            <p className="text-[13px] text-gray-500 mt-1 capitalize">Role: {role}</p>
          </div>
        </div>

        {/* ── MY ATTENDANCE ── */}
        <p className="text-[12px] font-bold tracking-widest text-gray-400 uppercase mt-7 mb-3">My Attendance</p>
        <div className="grid grid-cols-2 gap-3.5">

          <div
            onClick={() => navigate('/mark-attendance')}
            className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-[3px] hover:border-indigo-300 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-[11px] bg-blue-100 flex items-center justify-center text-[22px] mb-3.5 group-hover:scale-105 transition-transform duration-200">
              📷
            </div>
            <p className="text-[15px] font-semibold text-gray-900 leading-snug">Mark my attendance</p>
          </div>

          <div
            onClick={() => navigate('/calendar')}
            className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-[3px] hover:border-indigo-300 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-[11px] bg-purple-100 flex items-center justify-center text-[22px] mb-3.5 group-hover:scale-105 transition-transform duration-200">
              📅
            </div>
            <p className="text-[15px] font-semibold text-gray-900 leading-snug">My attendance calendar</p>
          </div>

        </div>

        {/* ── STUDENTS ── */}
        <p className="text-[12px] font-bold tracking-widest text-gray-400 uppercase mt-7 mb-3">Students</p>
        <div className="grid grid-cols-2 gap-3.5">

          <div
            onClick={() => navigate('/student-attendance')}
            className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-[3px] hover:border-green-300 transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-[11px] bg-green-100 flex items-center justify-center text-[22px] mb-3.5 group-hover:scale-105 transition-transform duration-200">
              ✅
            </div>
            <p className="text-[15px] font-semibold text-gray-900 leading-snug">Mark student attendance</p>
          </div>

          {role === 'admin' && (
            <div
              onClick={() => navigate('/manage-students')}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-[3px] hover:border-yellow-300 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-[11px] bg-yellow-100 flex items-center justify-center text-[22px] mb-3.5 group-hover:scale-105 transition-transform duration-200">
                🎓
              </div>
              <p className="text-[15px] font-semibold text-gray-900 leading-snug">Manage students</p>
            </div>
          )}

        </div>

        {/* ── ADMIN ── */}
        {role === 'admin' && (
          <>
            <p className="text-[12px] font-bold tracking-widest text-gray-400 uppercase mt-7 mb-3">Admin</p>
            <div
              onClick={() => navigate('/manage-users')}
              className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.07)] hover:shadow-lg hover:-translate-y-[3px] hover:border-gray-400 transition-all duration-200 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-[11px] bg-slate-100 flex items-center justify-center text-[22px] shrink-0 group-hover:scale-105 transition-transform duration-200">
                👥
              </div>
              <p className="text-[15px] font-semibold text-gray-900 leading-snug">Manage users</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Dashboard;
