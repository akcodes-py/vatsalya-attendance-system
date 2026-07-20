import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/users/email-login/', {
        email,
        password,
      });

      localStorage.setItem('token',   response.data.access);
      localStorage.setItem('refresh', response.data.refresh);

      const payload = JSON.parse(atob(response.data.access.split('.')[1]));
      localStorage.setItem('role',     payload.role     || 'user');
      localStorage.setItem('username', payload.username || email);

      navigate('/dashboard');
    } catch (err) {
      setError('Wrong email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex flex-col items-center justify-center p-7 font-['Inter',sans-serif]">
      {/* Brand header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-[#3d28b0] italic tracking-tight">Vatsalya Tatva</h1>
        <p className="text-sm text-gray-500 mt-1.5">सेवा परमो धर्मः</p>
      </div>

      {/* Login card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-[#3d28b0]/5 p-10 w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-7 text-center">Sign in to your Portal</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-2" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
              placeholder="e.g. admin@vatsalya.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold tracking-wide text-gray-500 uppercase mb-2" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-md text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 bg-[#3d28b0] hover:bg-[#4c35c7] text-white py-3.5 px-6 rounded-md text-[15px] font-semibold tracking-wide shadow-md shadow-[#3d28b0]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
