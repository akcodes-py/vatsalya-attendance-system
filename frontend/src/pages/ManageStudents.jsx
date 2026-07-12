import { useState, useEffect } from 'react';
import axios from 'axios';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const loadStudents = () => {
    axios.get('http://127.0.0.1:8000/api/students/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setStudents(res.data));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/students/',
        { name: newName, class_name: newClass, created_At: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Student added!');
      setNewName('');
      setNewClass('');
      loadStudents();
    } catch (err) {
      setMessage('❌ Failed to add student.');
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${studentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadStudents();
    } catch (err) {
      alert('Failed to delete student.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Manage Students</h2>

      {/* Add Student Form */}
      <form onSubmit={handleAddStudent} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
        <h3>Add New Student</h3>
        <input
          type="text"
          placeholder="Student Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="Class (e.g. 5A)"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Student
        </button>
        {message && <p style={{ marginTop: '10px', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      </form>

      {/* Students List */}
      <h3>All Students</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Class</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td style={tdStyle}>{student.name}</td>
              <td style={tdStyle}>{student.class_name}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleDelete(student.id)}
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

const thStyle = { padding: '10px', border: '1px solid #ccc', textAlign: 'center' };
const tdStyle = { padding: '10px', border: '1px solid #ccc', textAlign: 'center' };

export default ManageStudents;
