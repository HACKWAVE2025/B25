// import NurseNav from '../../components/NurseNav';
// export default function NurseHome() {
//   return (
//     <div>
//       <NurseNav />
//       <div style={{ padding:16 }}>
//         <h3>Nurse Dashboard</h3>
//         <ul>
//           <li>Register patients and create consultations</li>
//           <li>Payment-before-consultation enforced per hospital settings</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import NurseNav from '../../components/NurseNav';
import { useEffect, useState } from 'react';
import http from '../../api/http';

export default function NurseHome() {
  const [stats, setStats] = useState({
  patientsRegistered: 0,
  consultationsCreated: 0,
  consultationsCompleted: 0,
  revenue: 0
});

useEffect(() => {
  (async () => {
    try {
      const { data } = await http.get('/nurse/stats');
      setStats(data || {});
    } catch {
      // keep zeros on failure
    }
  })();
}, []);

  return (
    <>
      <style>{`
        .nurse-home { min-height: 100vh; background: var(--color-gray-50); }
        .nurse-content { max-width: 1400px; margin: 0 auto; padding: 48px 24px; }
        .page-title { font-size: 36px; font-weight: 700; color: var(--color-gray-700); margin-bottom: 8px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin: 40px 0; }
        .stat-card { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid var(--color-secondary); }
        .stat-icon { font-size: 40px; margin-bottom: 16px; }
        .stat-value { font-size: 48px; font-weight: 700; color: var(--color-secondary); }
        .stat-label { color: var(--color-gray-500); font-size: 14px; font-weight: 500; }
        .quick-actions { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .action-btn { padding: 12px 24px; background: linear-gradient(135deg, #00897B 0%, #26A69A 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,137,123,0.3); }
      `}</style>
      <div className="nurse-home">
        <NurseNav />
        <div className="nurse-content">
          <h1 className="page-title">Nurse Dashboard</h1>
          <p style={{color: 'var(--color-gray-400)', marginBottom: 32}}>Register patients and manage consultations</p>
          
<div className="stats-grid">
  <div className="stat-card">
    <div className="stat-icon">👥</div>
    <div className="stat-value">{stats.patientsRegistered ?? 0}</div>
    <div className="stat-label">PATIENTS REGISTERED</div>
  </div>

  <div className="stat-card">
    <div className="stat-icon">📋</div>
    <div className="stat-value">{stats.consultationsCreated ?? 0}</div>
    <div className="stat-label">CONSULTATIONS CREATED</div>
  </div>

  <div className="stat-card">
    <div className="stat-icon">✅</div>
    <div className="stat-value">{stats.consultationsCompleted ?? 0}</div>
    <div className="stat-label">COMPLETED CONSULTATIONS</div>
  </div>

  <div className="stat-card">
    <div className="stat-icon">💰</div>
    <div className="stat-value">₹{Number(stats.revenue || 0).toLocaleString('en-IN')}</div>
    <div className="stat-label">REVENUE (BY MY PATIENTS)</div>
  </div>
</div>

          
          <div className="quick-actions">
            <h3 style={{marginBottom: 24}}>Quick Actions</h3>
            <div style={{display: 'flex', gap: 16}}>
              <button className="action-btn" onClick={() => window.location.href = '/nurse/patients'}>
                ➕ Register Patient
              </button>
              <button className="action-btn" onClick={() => window.location.href = '/nurse/consultations'}>
                📝 Create Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

