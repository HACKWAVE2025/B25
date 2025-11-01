// export default function DoctorNav() {
//   const logout = async () => {
//     try {
//       await fetch(`${process.env.REACT_APP_API}/auth/logout`, { method: 'POST', credentials: 'include' });
//     } catch {}
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   };

//   return (
//     <div style={{ display:'flex', gap:16, alignItems:'center', padding:12, borderBottom:'1px solid #eee' }}>
//       <a href="/doctor">Dashboard</a>
//       <a href="/doctor/queue">Queue</a>
//       <a href="/doctor/in-progress">In Progress</a>
//       <div style={{ marginLeft:'auto' }}>
//         <button onClick={logout}>Logout</button>
//       </div>
//     </div>
//   );
// }
export default function DoctorNav() {
  const currentPath = window.location.pathname;

  const logout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    try {
      await fetch(`${process.env.REACT_APP_API}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        .doctor-nav {
          background: linear-gradient(135deg, #7E57C2 0%, #9575CD 100%);
          padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .doctor-nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          padding: 0 24px;
          height: 64px;
        }
        
        .doctor-logo {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-right: 48px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .doctor-links {
          display: flex;
          gap: 8px;
          flex: 1;
        }
        
        .doctor-link {
          color: rgba(255,255,255,0.85);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
          text-decoration: none;
        }
        
        .doctor-link:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }
        
        .doctor-link.active {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        
        .doctor-logout {
          padding: 8px 20px;
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          margin-left: auto;
        }
        
        .doctor-logout:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
      
      <nav className="doctor-nav">
        <div className="doctor-nav-container">
          <div className="doctor-logo">
            <span>👨‍⚕️</span>
            <span>Doctor Dashboard</span>
          </div>
          
          <div className="doctor-links">
            <a href="/doctor" className={`doctor-link ${currentPath === '/doctor' ? 'active' : ''}`}>
              Dashboard
            </a>
            <a href="/doctor/queue" className={`doctor-link ${currentPath === '/doctor/queue' ? 'active' : ''}`}>
              Queue
            </a>
            <a href="/doctor/in-progress" className={`doctor-link ${currentPath === '/doctor/in-progress' ? 'active' : ''}`}>
              In Progress
            </a>
          </div>
          
          <button onClick={logout} className="doctor-logout">
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

