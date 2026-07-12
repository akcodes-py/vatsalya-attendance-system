import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MarkAttendance from './pages/MarkAttendance';
import StudentAttendance from './pages/StudentAttendance';
import Calendar from './pages/Calendar';
import ManageUsers from './pages/ManageUsers';
import ManageStudents from './pages/ManageStudents';

// Simple check: if token exists, user is logged in
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<Login />} />

        {/* Protected routes — need to be logged in */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/mark-attendance" element={<PrivateRoute><MarkAttendance /></PrivateRoute>} />
        <Route path="/student-attendance" element={<PrivateRoute><StudentAttendance /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="/manage-users" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
        <Route path="/manage-students" element={<PrivateRoute><ManageStudents /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
