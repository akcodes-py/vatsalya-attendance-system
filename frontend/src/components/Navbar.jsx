import { useNavigate } from 'react-router-dom';

function Navbar({ pageTitle, pageIcon }) {
  const navigate = useNavigate();
  const role     = localStorage.getItem('role')     || 'user';
  const username = localStorage.getItem('username') || '';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-7 h-[58px] flex items-center justify-between sticky top-0 z-50 shadow-sm">
      {/* Left — Brand */}
      <div className="flex items-center gap-2.5">
        <span className="text-[19px] font-extrabold text-[#3d28b0] tracking-tight italic">
          Vatsalya Tatva
        </span>
        <span className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${
          role === 'admin'
            ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
            : 'bg-indigo-100 text-[#3d28b0] border border-indigo-300'
        }`}>
          {role}
        </span>
      </div>

      {/* Center — Current page indicator */}
      {pageTitle && (
        <div className="flex items-center">
          <span className="bg-[#3d28b0] text-white px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 cursor-default">
            {pageIcon && <span>{pageIcon}</span>}
            {pageTitle}
          </span>
        </div>
      )}

      {/* Right — User info + logout */}
      <div className="flex items-center gap-3.5">
        <span className="text-sm font-medium text-gray-500">
          Hi, {username}
        </span>
        <button
          onClick={handleLogout}
          className="bg-transparent border-[1.5px] border-red-600 text-red-600 px-4 py-1 rounded-md text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
