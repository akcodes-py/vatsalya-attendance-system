import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function StudentAttendance() {
  const [students,   setStudents]   = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message,    setMessage]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const today    = new Date().toISOString().split('T')[0];

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/students/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStudents(res.data);
        const defaults = {};
        res.data.forEach((s) => { defaults[s.id] = 'P'; });
        setAttendance(defaults);
      });
  }, []);

  const handleChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSubmit = async () => {
    setMessage('');
    setLoading(true);
    try {
      for (const student of students) {
        await axios.post(
          'http://127.0.0.1:8000/api/student-attendance/',
          { student: student.id, date: today, status: attendance[student.id] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setMessage('success');
    } catch (err) {
      setMessage('error');
    } finally {
      setLoading(false);
    }
  };

  const presentCount = Object.values(attendance).filter((v) => v === 'P').length;

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-['Inter',sans-serif]">
      <Navbar pageTitle="Student Attendance" pageIcon="✅" />

      <div className="max-w-[880px] mx-auto px-7 py-9">

        {/* Heading */}
        <div className="flex items-center justify-between mt-6 mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-gray-900 mb-1">Student Attendance</h2>
            <p className="text-sm text-gray-500 mb-0">📅 {today}</p>
          </div>
          <span className="bg-[#fef08a] text-[#713f12] border border-[#fde047] text-xs px-3 py-1 rounded-full font-bold">
            {presentCount} / {students.length} Present
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-[10px] border border-gray-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f7f8fc] border-b-[2px] border-gray-200">
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Class</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 p-8">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3.5 text-gray-900 font-semibold align-middle">{student.name}</td>
                    <td className="px-4 py-3.5 text-gray-500 align-middle">{student.class_name}</td>
                    <td className="px-4 py-3.5 align-middle">
                      <div className="flex items-center gap-1.5">
                        <label
                          className={`inline-flex items-center gap-1 cursor-pointer text-[13px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-colors duration-150 ${
                            attendance[student.id] === 'P'
                              ? 'bg-[#dcfce7] border-green-600 text-green-600'
                              : 'border-gray-200 bg-transparent text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            className="hidden"
                            name={`att-${student.id}`}
                            checked={attendance[student.id] === 'P'}
                            onChange={() => handleChange(student.id, 'P')}
                          />
                          Present
                        </label>
                        <label
                          className={`inline-flex items-center gap-1 cursor-pointer text-[13px] font-medium px-2.5 py-1 rounded-full border-[1.5px] transition-colors duration-150 ${
                            attendance[student.id] === 'A'
                              ? 'bg-[#fee2e2] border-red-600 text-red-600'
                              : 'border-gray-200 bg-transparent text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            className="hidden"
                            name={`att-${student.id}`}
                            checked={attendance[student.id] === 'A'}
                            onChange={() => handleChange(student.id, 'A')}
                          />
                          Absent
                        </label>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-2.5 mt-6">
          <button
            onClick={handleSubmit}
            disabled={loading || students.length === 0}
            className="bg-[#3d28b0] hover:bg-[#4c35c7] text-white px-6 py-2.5 rounded-md text-sm font-semibold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-55 disabled:hover:translate-y-0 disabled:shadow-none"
          >
            {loading ? 'Saving…' : '✅ Submit Attendance'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-transparent border-[1.5px] border-gray-200 text-gray-500 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back
          </button>
        </div>

        {/* Messages */}
        {message === 'success' && (
          <div className="mt-3.5 bg-[#dcfce7] text-green-600 border border-green-200 px-4 py-3 rounded-md text-sm font-medium">✅ Student attendance saved for today!</div>
        )}
        {message === 'error' && (
          <div className="mt-3.5 bg-[#fef9c3] text-yellow-800 border border-yellow-300 px-4 py-3 rounded-md text-sm font-medium">⚠️ Already submitted for today or something went wrong.</div>
        )}

      </div>
    </div>
  );
}

export default StudentAttendance;
