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
import { useEffect, useState } from 'react';
import http from '../../api/http';


export default function AdminHome() {
  const [stats, setStats] = useState({
  hospitalsCount: 0,
  doctorsCount: 0,
  nursesCount: 0,
  totalRevenue: 0,
  patientsPerHospital: []
});
useEffect(() => {
  (async () => {
    try {
      const { data } = await http.get('/admin/stats');
      setStats(data || {});
    } catch {
      setStats(prev => ({ ...prev }));
    }
  })();
}, []);

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
        
.pph-card{
  background: #ffffff !important;
  color: #111827 !important;              /* text in the card defaults to dark */
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.pph-title{
  color: #0f172a !important;              /* slate-900 */
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
}

.pph-list{ list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }

.pph-item{
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  background: #f8fafc !important;         /* slate-50/100 */
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.pph-left{ display: flex; align-items: center; gap: 12px; min-width: 0; }

.pph-icon{
  width: 40px; height: 40px; display: grid; place-items: center;
  background: #ffffff; border: 1px solid #e5e7eb; border-radius: 10px; flex-shrink: 0;
}

.pph-name{ color: #111827 !important; font-weight: 600; }  /* gray-900 */
.pph-id{ color: #6b7280 !important; font-size: 12px; }      /* gray-500 */
.pph-count{ color: #2563eb !important; font-weight: 700; white-space: nowrap; } /* primary */

.pph-empty{
  padding: 24px;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  color: #475569 !important;
  background: #f8fafc !important;
}

.pph-empty-icon{ font-size: 20px; }

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
    <div className="stat-value">{stats.hospitalsCount ?? 0}</div>
    <div className="stat-label">Hospitals</div>
  </div>

  <div className="stat-card" style={{borderLeftColor: 'var(--color-primary)'}}>
    <div className="stat-icon" style={{background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)'}}>👨‍⚕️</div>
    <div className="stat-value" style={{color: 'var(--color-primary)'}}>{stats.doctorsCount ?? 0}</div>
    <div className="stat-label">Doctors</div>
  </div>

  <div className="stat-card" style={{borderLeftColor: 'var(--color-success)'}}>
    <div className="stat-icon" style={{background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)'}}>🧑‍⚕️</div>
    <div className="stat-value" style={{color: 'var(--color-success)'}}>{stats.nursesCount ?? 0}</div>
    <div className="stat-label">Nurses</div>
  </div>

  <div className="stat-card" style={{borderLeftColor: '#f59e0b'}}>
    <div className="stat-icon" style={{background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'}}>💰</div>
    <div className="stat-value" style={{color: '#f59e0b'}}>₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}</div>
    <div className="stat-label">Total Revenue</div>
  </div>
</div>

<div className="pph-card">
  <h3 className="pph-title">Patients per Hospital</h3>

  {Array.isArray(stats.patientsPerHospital) && stats.patientsPerHospital.length > 0 ? (
    <ul className="pph-list">
      {stats.patientsPerHospital.map(row => (
        <li key={row.hospitalId} className="pph-item">
          <div className="pph-left">
            <div className="pph-icon">🏥</div>
            <div>
              <div className="pph-name">{row.hospitalName}</div>
              <div className="pph-id">ID: {row.hospitalId}</div>
            </div>
          </div>
          <div className="pph-count">{row.count} patients</div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="pph-empty">
      <div className="pph-empty-icon">ℹ️</div>
      <div>No patient registrations yet</div>
    </div>
  )}
</div>



          
        </div>
      </div>
    </>
  );
}

