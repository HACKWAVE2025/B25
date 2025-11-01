// // src/pages/owner/OwnerHome.jsx
// import OwnerNav from '../../components/OwnerNav';

// export default function OwnerHome() {
//   return (
//     <div>
//       <OwnerNav />
//       <div style={{ padding:16 }}>
//         <h3>Hospital Owner Dashboard</h3>
//         <ul>
//           <li>Create Nurse/Doctor accounts</li>
//           <li>Activate/Suspend staff</li>
//           <li>Payments and audit (coming)</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import OwnerNav from '../../components/OwnerNav';

export default function OwnerHome() {
  return (
    <>
      <style>{`
        .owner-home {
          min-height: 100vh;
          background: var(--color-gray-50);
        }
        
        .owner-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        
        .page-header {
          margin-bottom: 48px;
        }
        
        .page-title {
          font-size: 36px;
          font-weight: 700;
          color: var(--color-gray-700);
          margin-bottom: 8px;
        }
        
        .page-subtitle {
          color: var(--color-gray-400);
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
          border-left: 4px solid var(--color-gray-600);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        
        .stat-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #ECEFF1 0%, #CFD8DC 100%);
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
          color: var(--color-gray-600);
          margin-bottom: 8px;
        }
        
        .stat-label {
          color: var(--color-gray-500);
          font-size: 14px;
          font-weight: 500;
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
        }
        
        .action-list {
          display: grid;
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
        
        .action-btn {
          padding: 10px 24px;
          background: var(--color-gray-600);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .action-btn:hover {
          background: var(--color-gray-700);
        }
      `}</style>
      
      <div className="owner-home">
        <OwnerNav />
        
        <div className="owner-content">
          <div className="page-header">
            <h1 className="page-title">Hospital Dashboard</h1>
            <p className="page-subtitle">Manage your hospital staff and operations</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👨‍⚕️</div>
              <div className="stat-value">--</div>
              <div className="stat-label">ACTIVE STAFF</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏥</div>
              <div className="stat-value">--</div>
              <div className="stat-label">TOTAL PATIENTS</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">--</div>
              <div className="stat-label">CONSULTATIONS TODAY</div>
            </div>
          </div>
          
          <div className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            
            <div className="action-list">
              <div className="action-item">
                <div className="action-info">
                  <div className="action-icon">👨‍⚕️</div>
                  <div>
                    <h4 style={{margin:0, fontWeight:600}}>Manage Staff</h4>
                    <p style={{margin: '4px 0 0 0', fontSize: 13, color: 'var(--color-gray-400)'}}>
                      Create and manage nurse and doctor accounts
                    </p>
                  </div>
                </div>
                <button className="action-btn" onClick={() => window.location.href = '/owner/staff'}>
                  Manage →
                </button>
              </div>
              
              <div className="action-item">
                <div className="action-info">
                  <div className="action-icon">💳</div>
                  <div>
                    <h4 style={{margin:0, fontWeight:600}}>Payments & Audit</h4>
                    <p style={{margin: '4px 0 0 0', fontSize: 13, color: 'var(--color-gray-400)'}}>
                      View revenue and transaction history
                    </p>
                  </div>
                </div>
                <button className="action-btn" style={{opacity: 0.5}} disabled>
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

