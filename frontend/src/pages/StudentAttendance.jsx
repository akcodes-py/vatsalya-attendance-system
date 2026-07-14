import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentAttendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({}); // { studentId: 'P' or 'A' }
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const today = new Date().toISOString().split('T')[0];

  // Load all students when page opens
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/students/', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setStudents(res.data);
      // Set default attendance as Present for all
      const defaultAttendance = {};
      res.data.forEach((s) => {
        defaultAttendance[s.id] = 'P';
      });
      setAttendance(defaultAttendance);
    });
  }, []);

  const handleChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSubmit = async () => {
    setMessage('');
    try {
      // Submit attendance for each student
      for (const student of students) {
        await axios.post(
          'http://127.0.0.1:8000/api/student-attendance/',
          {
            student: student.id,
            date: today,
            status: attendance[student.id],
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setMessage('✅ Student attendance saved for today!');
    } catch (err) {
      setMessage('⚠️ Already submitted for today or something went wrong.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Student Attendance</h2>
      <p>Date: <strong>{today}</strong></p>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Class</th>
            <th style={thStyle}>Present</th>
            <th style={thStyle}>Absent</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td style={tdStyle}>{student.name}</td>
              <td style={tdStyle}>{student.class_name}</td>
              <td style={tdStyle}>
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  checked={attendance[student.id] === 'P'}
                  onChange={() => handleChange(student.id, 'P')}
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="radio"
                  name={`attendance-${student.id}`}
                  checked={attendance[student.id] === 'A'}
                  onChange={() => handleChange(student.id, 'A')}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmit}
        style={{ marginTop: '20px', padding: '10px 30px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Submit Attendance
      </button>

      {message && <p style={{ marginTop: '15px', color: message.startsWith('✅') ? 'green' : 'orange' }}>{message}</p>}

      <br />
      <button onClick={() => window.history.back()} style={{ marginTop: '10px', cursor: 'pointer' }}>
        ← Back
      </button>
    </div>
  );
}

const thStyle = { padding: '10px', border: '1px solid #ccc', textAlign: 'center' };
const tdStyle = { padding: '10px', border: '1px solid #ccc', textAlign: 'center' };

export default StudentAttendance;
