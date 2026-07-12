import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function MarkAttendance() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);        // captured photo data URL
  const [cameraOn, setCameraOn] = useState(false); // is camera open?
  const [submitted, setSubmitted] = useState(false);

  const videoRef = useRef(null);   // live camera video
  const canvasRef = useRef(null);  // for capturing snapshot
  const streamRef = useRef(null);  // to stop camera later

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const today = new Date().toISOString().split('T')[0];

  // Start the camera
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
      console.error("Camera error:", err);
      setError(`❌ Camera error: ${err.name} - ${err.message}. Please make sure no other app (like Zoom) is using the camera and reload the page.`);
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setCameraOn(false);
  };

  // Capture photo from the video
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
    stopCamera(); // turn off camera after capturing
  };

  // Submit attendance after photo captured
  const handleSubmit = async () => {
    setMessage('');
    setError('');
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/user-attendance/',
        {
          date: today,
          status: 'P',
          check_in: new Date().toTimeString().split(' ')[0],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('✅ Attendance marked successfully for today!');
      setSubmitted(true);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('⚠️ Attendance already marked for today.');
      } else {
        setError('Something went wrong. Try again.');
      }
    }
  };

  // Retake photo
  const retake = () => {
    setPhoto(null);
    setSubmitted(false);
    setMessage('');
    setError('');
    startCamera();
  };

  // Stop camera if user leaves page
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div style={{ maxWidth: '450px', margin: '60px auto', textAlign: 'center', padding: '20px' }}>
      <h2>Mark My Attendance</h2>
      <p>Today: <strong>{today}</strong></p>
      <p style={{ fontWeight: 'bold', fontSize: '18px' }}>👤 {username}</p>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Step 1: Open Camera button */}
      {!cameraOn && !photo && (
        <button
          onClick={startCamera}
          style={{ padding: '12px 30px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '20px' }}
        >
          📷 Open Camera
        </button>
      )}

      {/* Step 2: Live camera feed + Capture button */}
      <div style={{ marginTop: '20px', display: cameraOn ? 'block' : 'none' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ width: '100%', borderRadius: '8px', border: '3px solid #1a73e8' }}
        />
        <br />
        <button
          onClick={capturePhoto}
          style={{ marginTop: '12px', padding: '10px 30px', background: 'green', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
        >
          📸 Capture Photo
        </button>
        <button
          onClick={stopCamera}
          style={{ marginTop: '12px', marginLeft: '10px', padding: '10px 20px', background: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>

      {/* Step 3: Show captured photo + Confirm / Retake */}
      {photo && !submitted && (
        <div style={{ marginTop: '20px' }}>
          <p>✅ Photo captured! Confirm to mark attendance.</p>
          <img src={photo} alt="Captured" style={{ width: '100%', borderRadius: '8px', border: '3px solid green' }} />
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={handleSubmit}
              style={{ padding: '10px 25px', background: 'green', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px' }}
            >
              ✅ Confirm Attendance
            </button>
            <button
              onClick={retake}
              style={{ padding: '10px 20px', background: '#888', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              🔄 Retake
            </button>
          </div>
        </div>
      )}

      {/* Step 4: After submitted */}
      {photo && submitted && (
        <div style={{ marginTop: '20px' }}>
          <img src={photo} alt="Captured" style={{ width: '100%', borderRadius: '8px', border: '3px solid green' }} />
        </div>
      )}

      {message && <p style={{ color: 'green', marginTop: '15px', fontSize: '16px' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '15px', fontSize: '16px' }}>{error}</p>}

      <br />
      <button onClick={() => { stopCamera(); window.history.back(); }} style={{ marginTop: '10px', padding: '8px 20px', cursor: 'pointer' }}>
        ← Back
      </button>
    </div>
  );
}

export default MarkAttendance;
