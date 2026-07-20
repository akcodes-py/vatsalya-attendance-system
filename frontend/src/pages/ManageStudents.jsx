import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [newName,  setNewName]  = useState('');
  const [newClass, setNewClass] = useState('');
  const [message,  setMessage]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');

  const loadStudents = () => {
    axios
      .get('http://127.0.0.1:8000/api/students/', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudents(res.data));
  };

  useEffect(() => { loadStudents(); }, []);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/students/',
        { name: newName, class_name: newClass, created_At: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('success');
      setNewName('');
      setNewClass('');
      loadStudents();
    } catch {
      setMessage('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm('Delete this student? This action cannot be undone.')) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/students/${studentId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadStudents();
    } catch {
      alert('Failed to delete student.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-['Inter',sans-serif]">
      <Navbar pageTitle="Manage Students" pageIcon="🎓" />

      <div className="max-w-[880px] mx-auto px-7 py-9">

        {/* Heading */}
        <div className="mt-6 mb-6">
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">Manage Students</h2>
          <p className="text-sm text-gray-500 mb-0">
            {students.length} enrolled student{students.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Add Student Form */}
        <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.07)] border border-gray-200 p-6 mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-5">
            Add New Student
          </h3>
          <form onSubmit={handleAddStudent}>
            <div className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="s-name">Student Name *</label>
                <input
                  id="s-name"
                  type="text"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
                  placeholder="e.g. Rahul Sharma"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wide uppercase text-gray-500 mb-1.5" htmlFor="s-class">Class *</label>
                <input
                  id="s-class"
                  type="text"
                  className="w-full px-3.5 py-2.5 border-[1.5px] border-gray-200 rounded-md text-sm text-gray-900 bg-gray-50 focus:bg-white focus:border-[#3d28b0] focus:ring-4 focus:ring-[#3d28b0]/10 outline-none transition-all duration-200"
                  placeholder="e.g. Class 5A"
                  value={newClass}
                  onChange={(e) => setNewClass(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#3d28b0] hover:bg-[#4c35c7] text-white px-6 py-2.5 rounded-md text-sm font-semibold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1.5 disabled:opacity-55 disabled:hover:translate-y-0 disabled:shadow-none"
              >
                {loading ? 'Adding…' : '+ Add Student'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-transparent border-[1.5px] border-gray-200 text-gray-500 px-3.5 py-1.5 rounded-md text-[13px] font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              >
                ← Back
              </button>
            </div>

            {message === 'success' && <div className="mt-3.5 bg-[#dcfce7] text-green-600 border border-green-200 px-4 py-3 rounded-md text-sm font-medium">✅ Student added successfully!</div>}
            {message === 'error'   && <div className="mt-3.5 bg-[#fee2e2] text-red-600 border border-red-200 px-4 py-3 rounded-md text-sm font-medium">❌ Failed to add student.</div>}
          </form>
        </div>

        {/* Students Table */}
        <h3 className="text-base font-bold text-gray-900 mb-3.5">
          All Students
        </h3>
        <div className="overflow-x-auto rounded-[10px] border border-gray-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f7f8fc] border-b-[2px] border-gray-200">
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap w-12">#</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Class</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold tracking-wide uppercase text-gray-500 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 p-8">
                    No students enrolled yet.
                  </td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3.5 text-gray-400 font-medium align-middle">{idx + 1}</td>
                    <td className="px-4 py-3.5 text-gray-900 font-semibold align-middle">{student.name}</td>
                    <td className="px-4 py-3.5 text-gray-500 align-middle">{student.class_name}</td>
                    <td className="px-4 py-3.5 align-middle">
                      <button
                        onClick={() => handleDelete(student.id)}
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

export default ManageStudents;
