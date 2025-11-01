// import { useEffect, useState } from 'react';
// import DoctorNav from '../../components/DoctorNav';
// import http from '../../api/http';

// export default function InProgress() {
//   const [list, setList] = useState([]);
//   const [msg, setMsg] = useState('');
//   const [open, setOpen] = useState(false);
//   const [details, setDetails] = useState(null);

//   const load = async () => {
//     try {
//       const { data } = await http.get('/doctor/consultations/in-progress');
//       setList(data);
//     } catch { setList([]); }
//   };

//   useEffect(()=>{ load(); const t=setInterval(load, 8000); return ()=>clearInterval(t); }, []);

//   const complete = async (id) => {
//     setMsg('');
//     try {
//       await http.patch(`/doctor/consultations/${id}/complete`);
//       load();
//     } catch (e) {
//       setMsg(e.response?.data?.message || 'Failed');
//     }
//   };
//   const goWriteRx = (consultationIdHuman) => {
//   window.location.href = `/doctor/prescription?ref=${encodeURIComponent(consultationIdHuman)}`;
// };

// const viewMore = async (id) => {
//   try {
//     const { data } = await http.get(`/doctor/consultations/${id}/details`);
//     setDetails(data);
//     setOpen(true);
//   } catch (e) {
//     alert(e.response?.data?.message || 'Failed to load details');
//   }
// };


//   return (
//     <div>
//       <DoctorNav />
//       <div style={{ padding:16 }}>
//         <h3>In Progress</h3>
//         {msg && <p>{msg}</p>}
//         <table border="1" cellPadding="6">
//           <thead>
//             <tr><th>Consultation</th><th>Priority</th><th>Started</th><th>Actions</th></tr>
//           </thead>
//           <tbody>
//             {list.map(c=>(
//               <tr key={c.id}>
//                 <td>{c.consultationId}</td>
//                 <td>{c.priority}</td>
//                 <td>{c.startedAt ? new Date(c.startedAt).toLocaleString() : '-'}</td>
//                <td>
//                 <button onClick={()=>window.location.href=`/doctor/prescription?ref=${encodeURIComponent(c.consultationId)}`}>
//                  Write Rx
//                  </button>

//                 <button onClick={()=>complete(c.id)}>Complete</button>
//                 <button onClick={()=>window.location.href=`/doctor/consultations/${c.id}`} style={{ marginLeft:8 }}>
//                   View more
//                 </button>
//                 </td>

//               </tr>
//             ))}
//             {list.length===0 && <tr><td colSpan="4">No active consults</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import DoctorNav from '../../components/DoctorNav';
import http from '../../api/http';

export default function InProgress() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const { data } = await http.get('/doctor/consultations/in-progress');
      setList(data);
    } catch { setList([]); }
  };

  useEffect(()=>{ load(); const t=setInterval(load, 8000); return ()=>clearInterval(t); }, []);

  const complete = async (id) => {
    setMsg('');
    if (!window.confirm('Mark this consultation as completed?')) return;
    try {
      await http.patch(`/doctor/consultations/${id}/complete`);
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed');
    }
  };

  const getElapsedTime = (startedAt) => {
    if (!startedAt) return '—';
    const diff = Date.now() - new Date(startedAt).getTime();
    const mins = Math.floor(diff / 60000);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  return (
    <div className="in-progress-page">
      <style>{`
        .in-progress-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .progress-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }
        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: hsl(215 25% 27%);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .refresh-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: hsl(215 16% 47%);
        }
        .live-dot {
          width: 8px;
          height: 8px;
          background: hsl(38 92% 50%);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .alert {
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 20px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          background: hsl(4 90% 96%);
          color: hsl(4 90% 50%);
          border: 1px solid hsl(4 90% 86%);
        }
        
        .progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
        }
        
        .progress-card {
          background: white;
          border-radius: 16px;
          padding: 28px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          border: 2px solid hsl(38 92% 90%);
        }
        .progress-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.15);
          border-color: hsl(38 92% 50%);
        }
        
        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .consult-id {
          font-family: monospace;
          font-size: 14px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          background: hsl(210 40% 98%);
          padding: 6px 12px;
          border-radius: 6px;
        }
        .timer-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          background: hsl(38 92% 95%);
          color: hsl(38 92% 45%);
          gap: 6px;
        }
        
        .priority-indicator {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          background: hsl(212 90% 95%);
          color: hsl(212 90% 45%);
          gap: 4px;
          margin-bottom: 16px;
        }
        
        .started-info {
          padding: 12px;
          background: hsl(210 40% 98%);
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          color: hsl(215 16% 47%);
        }
        
        .card-actions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .btn {
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-primary {
          background: linear-gradient(135deg, hsl(261 47% 58%) 0%, hsl(261 57% 52%) 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(261 47% 58% / 0.3);
        }
        .btn-complete {
          background: linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(142 76% 30%) 100%);
          color: white;
        }
        .btn-complete:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(142 76% 36% / 0.3);
        }
        .btn-outline {
          background: white;
          border: 1px solid hsl(214 32% 91%);
          color: hsl(215 25% 27%);
          grid-column: 1 / -1;
        }
        .btn-outline:hover {
          background: hsl(210 40% 98%);
          border-color: hsl(261 47% 58%);
          color: hsl(261 47% 58%);
        }
        
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
        }
        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.3;
        }
        .empty-state h3 {
          font-size: 24px;
          color: hsl(215 25% 27%);
          margin: 0 0 8px 0;
        }
        .empty-state p {
          color: hsl(215 16% 47%);
          font-size: 16px;
        }
        
        @media (max-width: 768px) {
          .progress-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <DoctorNav />
      <div className="progress-container">
        <div className="page-header">
          <h1>
            <span>🔄</span>
            Active Consultations ({list.length})
          </h1>
          <div className="refresh-indicator">
            <div className="live-dot"></div>
            Auto-refreshing
          </div>
        </div>

        {msg && (
          <div className="alert">
            <span>⚠</span>
            {msg}
          </div>
        )}

        <div className="progress-grid">
          {list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💼</div>
              <h3>No active consultations</h3>
              <p>Check your queue for new cases to accept</p>
            </div>
          ) : (
            list.map(c=>(
              <div key={c.id} className="progress-card">
                <div className="card-header">
                  <div className="consult-id">{c.consultationId}</div>
                  <div className="timer-badge">
                    <span>⏱️</span>
                    {getElapsedTime(c.startedAt)}
                  </div>
                </div>

                <div className="priority-indicator">
                  {c.priority === 'urgent' ? '🔴' : '🟢'} {c.priority}
                </div>

                <div className="started-info">
                  <strong>Started:</strong> {c.startedAt ? new Date(c.startedAt).toLocaleString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '—'}
                </div>

                <div className="card-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={()=>window.location.href=`/doctor/prescription?ref=${encodeURIComponent(c.consultationId)}`}
                  >
                    <span>📝</span> Write Rx
                  </button>
                  <button className="btn btn-complete" onClick={()=>complete(c.id)}>
                    <span>✓</span> Complete
                  </button>
                  <button 
                    className="btn btn-outline" 
                    onClick={()=>window.location.href=`/doctor/consultations/${c.id}`}
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

