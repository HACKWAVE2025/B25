// export default function AdminNav() {
//   const user = JSON.parse(localStorage.getItem('user') || 'null');

//   const logout = async () => {
//     try {
//       await fetch(`${process.env.REACT_APP_API}/auth/logout`, {
//         method: 'POST',
//         credentials: 'include',
//       });
//     } catch {}
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   };

//   return (
//     <div style={{ display:'flex', gap:16, alignItems:'center', padding:12, borderBottom:'1px solid #eee' }}>
//       <a href="/admin">Dashboard</a>
//       <a href="/admin/hospitals">Hospitals</a>
//       <div style={{ marginLeft:'auto' }}>
//         <span style={{ marginRight:12 }}>{user?.email}</span>
//         <button onClick={logout}>Logout</button>
//       </div>
//     </div>
//   );
// }
export default function AdminNav() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const currentPath = window.location.pathname;

  const logout = async () => {
    if (!window.confirm('Are you sure you want to logout?')) return;
    try {
      await fetch(`${process.env.REACT_APP_API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        .admin-nav {
          background: linear-gradient(135deg, #0D47A1 0%, #1565C0 100%);
          padding: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .admin-nav-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          padding: 0 24px;
          height: 64px;
        }
        
        .admin-logo {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-right: 48px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .admin-links {
          display: flex;
          gap: 8px;
          flex: 1;
        }
        
        .admin-link {
          color: rgba(255,255,255,0.85);
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s;
          text-decoration: none;
        }
        
        .admin-link:hover {
          background: rgba(255,255,255,0.15);
          color: white;
        }
        
        .admin-link.active {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        
        .admin-user {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-left: auto;
        }
        
        .admin-email {
          color: rgba(255,255,255,0.9);
          font-size: 14px;
          font-weight: 500;
        }
        
        .admin-logout {
          padding: 8px 20px;
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .admin-logout:hover {
          background: rgba(255,255,255,0.3);
        }
        
        @media (max-width: 768px) {
          .admin-nav-container {
            padding: 0 16px;
          }
          .admin-logo {
            font-size: 16px;
            margin-right: 16px;
          }
          .admin-link {
            padding: 8px 12px;
            font-size: 13px;
          }
          .admin-email {
            display: none;
          }
        }
      `}</style>
      
      <nav className="admin-nav">
        <div className="admin-nav-container">
          <div className="admin-logo">
            <span>🏥</span>
            <span>AyuSahayak Admin</span>
          </div>
          
          <div className="admin-links">
            <a 
              href="/admin" 
              className={`admin-link ${currentPath === '/admin' ? 'active' : ''}`}
            >
              Dashboard
            </a>
            <a 
              href="/admin/hospitals" 
              className={`admin-link ${currentPath === '/admin/hospitals' ? 'active' : ''}`}
            >
              Hospitals
            </a>
          </div>
          
          <div className="admin-user">
            <span className="admin-email">{user?.email}</span>
            <button onClick={logout} className="admin-logout">
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

