import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ManageUsers() {
  const [users,   setUsers]   = useState([]);
  const [form,    setForm]    = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');

  const loadUsers = () => {
    axios
      .get('http://127.0.0.1:8000/api/users/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data));
  };

  useEffect(() => { loadUsers(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/users/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('success');
      setForm({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'user' });
      loadUsers();
    } catch (err) {
      setMessage('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadUsers();
    } catch {
      alert('Failed to delete user.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-['Inter',sans-serif]">
      <Navbar pageTitle="Manage Users" pageIcon="👥" />

      <div className="max-w-[880px] mx-auto px-7 py-9">

        {/* Heading */}
        <div className="mt-6 mb-6">
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">Manage Users</h2>
          <p className="text-sm text-gray-500 mb-0">
            {users.length} registered user{users.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Add User Form */}
        <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.07)] border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Add New User
          </h3>
          <form onSubmit={handleAddUser}>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="u-username">Username *</label>
                <input
                  id="u-username"
                  name="username"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
                  placeholder="e.g. john123"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="u-email">Email * (used to login)</label>
                <input
                  id="u-email"
                  name="email"
                  type="email"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
                  placeholder="e.g. john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="u-first">First Name</label>
                <input
                  id="u-first"
                  name="first_name"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
                  placeholder="e.g. John"
                  value={form.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="u-last">Last Name</label>
                <input
                  id="u-last"
                  name="last_name"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
                  placeholder="e.g. Doe"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="u-password">Password *</label>
                <input
                  id="u-password"
                  name="password"
                  type="password"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
                  placeholder="Min 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="u-role">Role</label>
                <select
                  id="u-role"
                  name="role"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22%3E%3Cpath fill=%22%236b7280%22 d=%22M6 8L1 3h10z%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center]"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3d28b0] hover:bg-[#4c35c7] text-white px-6 py-2.5 rounded-md text-sm font-semibold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-55 disabled:hover:translate-y-0 disabled:shadow-none"
              >
                {loading ? 'Adding…' : '+ Add User'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-transparent border-[1.5px] border-gray-200 text-gray-500 px-3.5 py-1.5 rounded-md text-[13px] font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              >
                ← Back
              </button>
            </div>

            {message === 'success' && <div className="mt-3.5 bg-[#dcfce7] text-green-600 border border-green-200 px-4 py-3 rounded-md text-sm font-medium">✅ User added successfully!</div>}
            {message === 'error'   && <div className="mt-3.5 bg-[#fee2e2] text-red-600 border border-red-200 px-4 py-3 rounded-md text-sm font-medium">❌ Failed to add user. Check all fields.</div>}
          </form>
        </div>

        {/* Users Table */}
        <h3 className="text-base font-bold text-gray-900 mb-3.5">
          All Users
        </h3>
        <div className="overflow-x-auto rounded-[10px] border border-gray-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f7f8fc] border-b-[2px] border-gray-200">
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Username</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Email</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Full Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Role</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 p-8">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3.5 text-gray-900 font-semibold align-middle">{user.username}</td>
                    <td className="px-4 py-3.5 text-gray-500 align-middle">{user.email}</td>
                    <td className="px-4 py-3.5 text-gray-900 align-middle">{user.first_name} {user.last_name}</td>
                    <td className="px-4 py-3.5 align-middle">
                      <span className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${
                        user.role === 'admin'
                          ? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                          : 'bg-indigo-100 text-[#3d28b0] border border-indigo-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 align-middle">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ManageUsers;
