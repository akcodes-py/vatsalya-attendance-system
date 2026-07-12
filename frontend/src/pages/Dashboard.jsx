import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username');
  const [dark, setDark] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const avatarLetter = username ? username[0].toUpperCase() : 'U';

  // Theme colors
  const theme = {
    page: dark ? '#121212' : '#f5f5f5',
    container: dark ? '#121212' : '#f5f5f5',
    card: dark ? '#1e1e1e' : '#ffffff',
    cardHover: dark ? '#2a2a2a' : '#e8e8e8',
    cardBorder: dark ? '#2a2a2a' : '#ddd',
    text: dark ? '#ffffff' : '#111111',
    subText: dark ? '#aaa' : '#555',
    sectionLabel: dark ? '#888' : '#666',
    logoutBg: dark ? '#3a0000' : '#ffe5e5',
    logoutText: dark ? '#ff6b6b' : '#cc0000',
    toggleBg: dark ? '#2a2a2a' : '#e0e0e0',
    toggleText: dark ? '#ffffff' : '#111111',
  };

  const cardStyle = (id) => ({
    background: hoveredCard === id ? theme.cardHover : theme.card,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: '12px',
    padding: '20px 16px',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.15s',
    transform: hoveredCard === id ? 'scale(1.03)' : 'scale(1)',
  });

  const wideCardStyle = (id) => ({
    ...cardStyle(id),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '14px',
  });

  return (
    <div style={{ minHeight: '100vh', background: theme.page, display: 'flex', justifyContent: 'center', padding: '20px', transition: 'background 0.3s' }}>
      <div style={{ width: '100%', maxWidth: '500px', paddingBottom: '30px' }}>

        {/* Fixed Top-Right — Dark/Light Mode Toggle */}
        <button
          onClick={() => setDark(!dark)}
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            background: dark ? '#2a2a2a' : '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '17px',
            boxShadow: dark ? '0 0 8px rgba(255,255,255,0.15)' : '0 0 8px rgba(0,0,0,0.2)',
            transition: 'background 0.3s, transform 0.2s',
            zIndex: 999,
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {dark ? '☀️' : '🌙'}
        </button>

        {/* Header — Avatar + Welcome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '30px', marginTop: '10px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#1a73e8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', flexShrink: 0 }}>
            {avatarLetter}
          </div>
          <div>
            <h2 style={{ color: theme.text, margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Welcome, {username}</h2>
            <p style={{ color: theme.subText, margin: '4px 0 0 0', fontSize: '14px' }}>Role: {role}</p>
          </div>
        </div>

        {/* Section: My Attendance */}
        <p style={{ color: theme.sectionLabel, fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px', marginTop: '20px' }}>MY ATTENDANCE</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          <div
            style={cardStyle('mark')}
            onClick={() => navigate('/mark-attendance')}
            onMouseEnter={() => setHoveredCard('mark')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#1a73e8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '20px' }}>📷</div>
            <p style={{ color: theme.text, margin: 0, fontSize: '15px', fontWeight: '600' }}>Mark my attendance</p>
          </div>

          <div
            style={cardStyle('cal')}
            onClick={() => navigate('/calendar')}
            onMouseEnter={() => setHoveredCard('cal')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '20px' }}>📅</div>
            <p style={{ color: theme.text, margin: 0, fontSize: '15px', fontWeight: '600' }}>My attendance calendar</p>
          </div>

        </div>

        {/* Section: Students */}
        <p style={{ color: theme.sectionLabel, fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px', marginTop: '24px' }}>STUDENTS</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

          <div
            style={cardStyle('statt')}
            onClick={() => navigate('/student-attendance')}
            onMouseEnter={() => setHoveredCard('statt')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '20px' }}>✅</div>
            <p style={{ color: theme.text, margin: 0, fontSize: '15px', fontWeight: '600' }}>Mark student attendance</p>
          </div>

          {role === 'admin' && (
            <div
              style={cardStyle('stmng')}
              onClick={() => navigate('/manage-students')}
              onMouseEnter={() => setHoveredCard('stmng')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', fontSize: '20px' }}>🎓</div>
              <p style={{ color: theme.text, margin: 0, fontSize: '15px', fontWeight: '600' }}>Manage students</p>
            </div>
          )}

        </div>

        {/* Section: Admin */}
        {role === 'admin' && (
          <>
            <p style={{ color: theme.sectionLabel, fontSize: '13px', fontWeight: '700', letterSpacing: '1px', marginBottom: '10px', marginTop: '24px' }}>ADMIN</p>
            <div
              style={wideCardStyle('usrmng')}
              onClick={() => navigate('/manage-users')}
              onMouseEnter={() => setHoveredCard('usrmng')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>👥</div>
              <p style={{ color: theme.text, margin: 0, fontSize: '15px', fontWeight: '600' }}>Manage users</p>
            </div>
          </>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          onMouseEnter={(e) => e.target.style.opacity = '0.85'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
          style={{ marginTop: '30px', width: '100%', padding: '14px', background: '#c0392b', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', fontWeight: '600', transition: 'opacity 0.2s' }}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;
