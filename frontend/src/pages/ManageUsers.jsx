import { useState, useEffect } from 'react';
import axios from 'axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'user',
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const loadUsers = () => {
    axios.get('http://127.0.0.1:8000/api/users/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/users/',
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ User added successfully!');
      setForm({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'user' });
      loadUsers();
    } catch (err) {
      setMessage('❌ Failed to add user. Check all fields.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadUsers();
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '50px auto', padding: '20px' }}>
      <h2>Manage Users</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px', marginBottom: '30px' }}>
        <h3>Add New User</h3>

        <label>Username * (used internally)</label>
        <input name="username" value={form.username} onChange={handleChange} required
          style={inputStyle} placeholder="e.g. john123" />

        <label>Email * (used to login)</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required
          style={inputStyle} placeholder="e.g. john@example.com" />

        <label>Password * (given by admin)</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} required
          style={inputStyle} placeholder="Min 8 characters" />

        <label>First Name</label>
        <input name="first_name" value={form.first_name} onChange={handleChange}
          style={inputStyle} placeholder="e.g. John" />

        <label>Last Name</label>
        <input name="last_name" value={form.last_name} onChange={handleChange}
          style={inputStyle} placeholder="e.g. Doe" />

        <label>Role</label>
        <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" style={{ padding: '10px 25px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          Add User
        </button>

        {message && <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      </form>

      {/* Users List */}
      <h3>All Users</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={tdStyle}>{user.username}</td>
              <td style={tdStyle}>{user.email}</td>
              <td style={tdStyle}>{user.first_name} {user.last_name}</td>
              <td style={tdStyle}>{user.role}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ background: 'red', color: 'white', border: 'none', padding: '4px 10px', cursor: 'pointer', borderRadius: '4px' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <button onClick={() => window.history.back()} style={{ cursor: 'pointer' }}>← Back</button>
    </div>
  );
}

const inputStyle = { width: '100%', padding: '8px', marginBottom: '12px', marginTop: '4px', display: 'block', boxSizing: 'border-box' };
const thStyle = { padding: '10px', border: '1px solid #ccc', textAlign: 'center' };
const tdStyle = { padding: '10px', border: '1px solid #ccc', textAlign: 'center' };

export default ManageUsers;
