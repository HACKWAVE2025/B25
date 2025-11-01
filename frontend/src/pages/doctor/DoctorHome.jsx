// import DoctorNav from '../../components/DoctorNav';
// export default function DoctorHome() {
//   return (
//     <div>
//       <DoctorNav />
//       <div style={{ padding:16 }}>
//         <h3>Doctor Dashboard</h3>
//         <ul>
//           <li>See in-queue consultations (urgent-first, then FIFO)</li>
//           <li>Accept to begin, decline with reason, complete when done</li>
//         </ul>
//       </div>
//     </div>
//   );
// }
import DoctorNav from '../../components/DoctorNav';
export default function DoctorHome() {
  return (
    <>
      <style>{`
        .doctor-home { min-height: 100vh; background: var(--color-gray-50); }
        .doctor-content { max-width: 1400px; margin: 0 auto; padding: 48px 24px; }
        .page-title { font-size: 36px; font-weight: 700; color: var(--color-gray-700); margin-bottom: 8px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin: 40px 0; }
        .stat-card { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid var(--color-accent); }
        .stat-icon { font-size: 40px; margin-bottom: 16px; }
        .stat-value { font-size: 48px; font-weight: 700; color: var(--color-accent); }
        .quick-actions { background: white; padding: 32px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .action-btn { padding: 12px 24px; background: linear-gradient(135deg, #7E57C2 0%, #9575CD 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(126,87,194,0.3); }
      `}</style>
      <div className="doctor-home">
        <DoctorNav />
        <div className="doctor-content">
          <h1 className="page-title">Doctor Dashboard</h1>
          <p style={{color: 'var(--color-gray-400)', marginBottom: 32}}>Review consultations and provide expert medical care</p>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-value">--</div>
              <div>IN QUEUE</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-value">--</div>
              <div>IN PROGRESS</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">--</div>
              <div>COMPLETED TODAY</div>
            </div>
          </div>
          
          <div className="quick-actions">
            <h3 style={{marginBottom: 24}}>Quick Actions</h3>
            <div style={{display: 'flex', gap: 16}}>
              <button className="action-btn" onClick={() => window.location.href = '/doctor/queue'}>
                📋 View Queue
              </button>
              <button className="action-btn" onClick={() => window.location.href = '/doctor/in-progress'}>
                🔄 In Progress Cases
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

