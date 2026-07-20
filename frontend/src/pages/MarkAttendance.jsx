import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function MarkAttendance() {
  const [message,   setMessage]   = useState('');
  const [error,     setError]     = useState('');
  const [photo,     setPhoto]     = useState(null);
  const [cameraOn,  setCameraOn]  = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate  = useNavigate();

  const token    = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const today    = new Date().toISOString().split('T')[0];

  const startCamera = async () => {
    setPhoto(null);
    setMessage('');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      setError(`Camera error: ${err.name} — ${err.message}. Make sure no other app is using the camera.`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setCameraOn(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL('image/png'));
    stopCamera();
  };

  const handleSubmit = async () => {
    setMessage('');
    setError('');
    try {
      const base64Response = await fetch(photo);
      const blob = await base64Response.blob();

      const formData = new FormData();
      formData.append('photo',     blob, 'attendance.png');
      formData.append('date',      today);
      formData.append('status',    'P');
      formData.append('check_in',  new Date().toTimeString().split(' ')[0]);

      await axios.post('http://127.0.0.1:8000/api/user-attendance/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Attendance marked successfully for today!');
      setSubmitted(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Attendance already marked for today.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    }
  };

  const retake = () => {
    setPhoto(null);
    setSubmitted(false);
    setMessage('');
    setError('');
    startCamera();
  };

  useEffect(() => () => stopCamera(), []);

  return (
    <div className="min-h-screen bg-[#f7f8fc] font-['Inter',sans-serif]">
      <Navbar pageTitle="Mark Attendance" pageIcon="📷" />

      <div className="max-w-[500px] mx-auto px-7 py-9">

        {/* Page heading */}
        <div className="mt-6 mb-4">
          <h2 className="text-[22px] font-bold text-gray-900 mb-1">Mark My Attendance</h2>
          <p className="text-sm text-gray-500 mb-7">
            📅 {today} &nbsp;·&nbsp; 👤 {username}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.07)] border border-gray-200 p-6">
          {/* Hidden canvas */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Step 1: Open Camera */}
          {!cameraOn && !photo && (
            <div className="text-center">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-[15px] text-gray-500 mb-4">
                Take a selfie to mark your attendance for today.
              </p>
              <button
                onClick={startCamera}
                className="bg-[#3d28b0] hover:bg-[#4c35c7] text-white px-6 py-2.5 rounded-md text-sm font-semibold tracking-wide shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center mx-auto"
              >
                Open Camera
              </button>
            </div>
          )}

          {/* Step 2: Camera feed */}
          <div style={{ display: cameraOn ? 'block' : 'none' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-xl border-[2.5px] border-[#3d28b0] block"
            />
            <div className="flex items-center justify-center gap-2.5 mt-4">
              <button
                onClick={capturePhoto}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-[1px]"
              >
                📸 Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="bg-[#f7f8fc] hover:bg-gray-200 border-[1.5px] border-gray-200 text-gray-500 hover:text-gray-900 px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Step 3: Confirm photo */}
          {photo && !submitted && (
            <div>
              <p className="text-center font-semibold mb-2 text-green-600">
                ✅ Photo captured! Confirm to mark attendance.
              </p>
              <img src={photo} alt="Captured" className="w-full rounded-xl border-[2.5px] border-green-600 block" />
              <div className="flex items-center justify-center gap-2.5 mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-all duration-200 hover:-translate-y-[1px]"
                >
                  ✅ Confirm Attendance
                </button>
                <button
                  onClick={retake}
                  className="bg-[#f7f8fc] hover:bg-gray-200 border-[1.5px] border-gray-200 text-gray-500 hover:text-gray-900 px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-all duration-200"
                >
                  🔄 Retake
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Submitted */}
          {photo && submitted && (
            <div>
              <img src={photo} alt="Captured" className="w-full rounded-xl border-[2.5px] border-green-600 block" />
            </div>
          )}

          {/* Messages */}
          {message && <div className="mt-3.5 bg-[#dcfce7] text-green-600 border border-green-200 px-4 py-3 rounded-md text-sm font-medium">✅ {message}</div>}
          {error   && <div className="mt-3.5 bg-[#fee2e2] text-red-600 border border-red-200 px-4 py-3 rounded-md text-sm font-medium">⚠️ {error}</div>}
        </div>

        {/* Back */}
        <div className="mt-4">
          <button
            onClick={() => { stopCamera(); navigate('/dashboard'); }}
            className="bg-transparent border-[1.5px] border-gray-200 text-gray-500 px-3.5 py-1.5 rounded-md text-[13px] font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            ← Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

export default MarkAttendance;
