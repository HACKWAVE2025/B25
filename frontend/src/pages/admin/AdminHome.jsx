// import AdminNav from '../../components/AdminNav';

// export default function AdminHome() {
//   return (
//     <div>
//       <AdminNav />
//       <div style={{ padding: 16 }}>
//         <h3>Admin Dashboard</h3>
//         <ul>
//           <li>Quick actions: Create Hospital + Owner</li>
//           <li>View hospitals list, suspend/activate</li>
//           <li>Recent admin actions (coming)</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import AdminNav from '../../components/AdminNav';

export default function AdminHome() {
  return (
    <>
      <style>{`
        .admin-home {
          min-height: 100vh;
          background: var(--color-gray-50);
        }
        
        .admin-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        
        .admin-header {
          margin-bottom: 48px;
        }
        
        .admin-title {
          font-size: 36px;
          font-weight: 700;
          color: var(--color-gray-700);
          margin-bottom: 8px;
        }
        
        .admin-subtitle {
          color: var(--color-gray-400);
          font-size: 16px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 48px;
        }
        
        .stat-card {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s;
          border-left: 4px solid var(--color-primary);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        .stat-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin-bottom: 16px;
        }
        
        .stat-value {
          font-size: 48px;
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: 8px;
          line-height: 1;
        }
        
        .stat-label {
          color: var(--color-gray-500);
          font-size: 14px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .quick-actions {
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-gray-700);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .action-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .action-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: var(--color-gray-50);
          border-radius: 12px;
          transition: all 0.2s;
        }
        
        .action-item:hover {
          background: var(--color-gray-100);
        }
        
        .action-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .action-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
        }
        
        .action-text h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--color-gray-700);
        }
        
        .action-text p {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: var(--color-gray-400);
        }
        
        .action-btn {
          padding: 10px 24px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }
        
        .action-btn:hover {
          background: var(--color-primary-light);
          transform: translateX(4px);
        }
      `}</style>
      
      <div className="admin-home">
        <AdminNav />
        
        <div className="admin-content">
          <div className="admin-header">
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage hospitals, monitor activity, and oversee platform operations</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-value">--</div>
              <div className="stat-label">Total Hospitals</div>
            </div>
            
            <div className="stat-card" style={{borderLeftColor: 'var(--color-success)'}}>
              <div className="stat-icon" style={{background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'}}>✅</div>
              <div className="stat-value" style={{color: 'var(--color-success)'}}>--</div>
              <div className="stat-label">Active Hospitals</div>
            </div>
            
            <div className="stat-card" style={{borderLeftColor: 'var(--color-danger)'}}>
              <div className="stat-icon" style={{background: 'linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%)'}}>⏸️</div>
              <div className="stat-value" style={{color: 'var(--color-danger)'}}>--</div>
              <div className="stat-label">Suspended</div>
            </div>
          </div>
          
          <div className="quick-actions">
            <h3 className="section-title">
              <span>⚡</span>
              Quick Actions
            </h3>
            
            <div className="action-list">
              <div className="action-item">
                <div className="action-info">
                  <div className="action-icon">🏥</div>
                  <div className="action-text">
                    <h4>Create Hospital</h4>
                    <p>Register a new hospital with owner account</p>
                  </div>
                </div>
                <button className="action-btn" onClick={() => window.location.href = '/admin/hospitals'}>
                  Go →
                </button>
              </div>
              
              <div className="action-item">
                <div className="action-info">
                  <div className="action-icon">📋</div>
                  <div className="action-text">
                    <h4>View All Hospitals</h4>
                    <p>Manage hospital status and settings</p>
                  </div>
                </div>
                <button className="action-btn" onClick={() => window.location.href = '/admin/hospitals'}>
                  View →
                </button>
              </div>
              
              <div className="action-item">
                <div className="action-info">
                  <div className="action-icon">📊</div>
                  <div className="action-text">
                    <h4>Activity Report</h4>
                    <p>Recent admin actions and system logs</p>
                  </div>
                </div>
                <button className="action-btn" style={{opacity: 0.5, cursor: 'not-allowed'}} disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

