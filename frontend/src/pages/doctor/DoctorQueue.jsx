// import { useEffect, useState } from 'react';
// import DoctorNav from '../../components/DoctorNav';
// import http from '../../api/http';

// export default function DoctorQueue() {
//   const [list, setList] = useState([]);
//   const [msg, setMsg] = useState('');

//   const load = async () => {
//     try {
//       const { data } = await http.get('/doctor/consultations?status=in_queue');
//       setList(data);
//     } catch { setList([]); }
//   };

//   useEffect(()=>{ load(); const t=setInterval(load, 8000); return ()=>clearInterval(t); }, []);

//   const accept = async (id) => {
//     setMsg('');
//     try {
//       await http.patch(`/doctor/consultations/${id}/accept`);
//       window.location.href = '/doctor/in-progress';
//     } catch (e) { setMsg(e.response?.data?.message || 'Failed'); }
//   };

//   const decline = async (id) => {
//     const reason = prompt('Reason for decline?') || 'no reason';
//     try {
//       await http.patch(`/doctor/consultations/${id}/decline`, { reason });
//       load();
//     } catch (e) {}
//   };

//   return (
//     <div>
//       <DoctorNav />
//       <div style={{ padding:16 }}>
//         <h3>Queue</h3>
//         {msg && <p>{msg}</p>}
//         <table border="1" cellPadding="6">
//           <thead>
//           <tr>
//             <th>Consultation</th>
//             <th>Patient</th>
//             <th>Priority</th>
//             <th>Created</th>
//             <th>Actions</th>
//           </tr>
//           </thead>
//         <tbody>
//           {list.map(c=>(
//             <tr key={c.id}>
//               <td>{c.consultationId}</td>
//               <td>
//                 {c.patient ? (
//                   <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//                     {c.patient.photo && <img src={c.patient.photo} alt="photo" style={{ width:48, height:48, objectFit:'cover', borderRadius:4 }} />}
//                     <div>
//                       <div>{c.patient.name}</div>
//                       <div style={{ fontSize:12, color:'#666' }}>
//                         {c.patient.gender}, {c.patient.age} • {c.patient.conditionType}
//                       </div>
//                     </div>
//                   </div>
//                 ) : '—'}
//               </td>
//               <td>{c.priority}</td>
//               <td>{new Date(c.createdAt).toLocaleString()}</td>
//               <td>
//                 <button onClick={()=>accept(c.id)}>Accept</button>
//                 <button onClick={()=>decline(c.id)} style={{ marginLeft:8 }}>Decline</button>
//                 <button onClick={()=>window.location.href=`/doctor/consultations/${c.id}`} style={{ marginLeft:8 }}>
//                    View more
//                  </button>
//               </td>
//             </tr>
//           ))}
//           {list.length===0 && <tr><td colSpan="5">No cases in queue</td></tr>}
//         </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import DoctorNav from '../../components/DoctorNav';
import http from '../../api/http';

export default function DoctorQueue() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
    try {
      const { data } = await http.get('/doctor/consultations?status=in_queue');
      setList(data);
    } catch { setList([]); }
  };

  useEffect(()=>{ load(); const t=setInterval(load, 8000); return ()=>clearInterval(t); }, []);

  const accept = async (id) => {
    setMsg('');
    try {
      await http.patch(`/doctor/consultations/${id}/accept`);
      window.location.href = '/doctor/in-progress';
    } catch (e) { setMsg(e.response?.data?.message || 'Failed'); }
  };

  const decline = async (id) => {
    const reason = prompt('Reason for decline?') || 'no reason';
    try {
      await http.patch(`/doctor/consultations/${id}/decline`, { reason });
      load();
    } catch (e) {}
  };

  return (
    <div className="queue-page">
      <style>{`
        .queue-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .queue-container {
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
          background: hsl(142 76% 36%);
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
        
        .queue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
          gap: 24px;
        }
        
        .queue-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s;
          border: 2px solid transparent;
        }
        .queue-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.15);
          border-color: hsl(261 47% 58%);
        }
        .queue-card.urgent {
          border-color: hsl(4 90% 70%);
          animation: urgentPulse 2s infinite;
        }
        @keyframes urgentPulse {
          0%, 100% { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          50% { box-shadow: 0 4px 12px 0 hsla(4 90% 70% / 0.3); }
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
        .priority-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          gap: 4px;
        }
        .priority-normal {
          background: hsl(212 90% 95%);
          color: hsl(212 90% 45%);
        }
        .priority-urgent {
          background: hsl(4 90% 95%);
          color: hsl(4 90% 50%);
          animation: pulse 2s infinite;
        }
        
        .patient-section {
          margin-bottom: 20px;
          padding: 16px;
          background: hsl(210 40% 98%);
          border-radius: 12px;
        }
        .patient-info {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;
        }
        .patient-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .patient-details h3 {
          font-size: 18px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          margin: 0 0 4px 0;
        }
        .patient-meta {
          font-size: 14px;
          color: hsl(215 16% 47%);
        }
        .complaint-box {
          padding: 12px;
          background: white;
          border-radius: 8px;
          border-left: 3px solid hsl(261 47% 58%);
        }
        .complaint-label {
          font-size: 12px;
          font-weight: 600;
          color: hsl(215 16% 47%);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .complaint-text {
          font-size: 14px;
          color: hsl(215 25% 27%);
          line-height: 1.5;
        }
        
        .card-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          font-size: 13px;
          color: hsl(215 16% 47%);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .card-actions {
          display: flex;
          gap: 10px;
        }
        .btn {
          flex: 1;
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
        .btn-accept {
          background: linear-gradient(135deg, hsl(261 47% 58%) 0%, hsl(261 57% 52%) 100%);
          color: white;
        }
        .btn-accept:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(261 47% 58% / 0.3);
        }
        .btn-decline {
          background: white;
          border: 1px solid hsl(214 32% 91%);
          color: hsl(4 90% 50%);
        }
        .btn-decline:hover {
          background: hsl(4 90% 96%);
          border-color: hsl(4 90% 70%);
        }
        .btn-details {
          background: white;
          border: 1px solid hsl(214 32% 91%);
          color: hsl(215 25% 27%);
        }
        .btn-details:hover {
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
          .queue-grid {
            grid-template-columns: 1fr;
          }
          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
      
      <DoctorNav />
      <div className="queue-container">
        <div className="page-header">
          <h1>
            <span>📋</span>
            Consultation Queue ({list.length})
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

        <div className="queue-grid">
          {list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🩺</div>
              <h3>No cases in queue</h3>
              <p>All consultations have been handled. Great work!</p>
            </div>
          ) : (
            list.map(c=>(
              <div key={c.id} className={`queue-card ${c.priority === 'urgent' ? 'urgent' : ''}`}>
                <div className="card-header">
                  <div className="consult-id">{c.consultationId}</div>
                  <span className={`priority-badge priority-${c.priority}`}>
                    {c.priority === 'urgent' && '🔴'}
                    {c.priority === 'normal' && '🟢'}
                    {' '}{c.priority}
                  </span>
                </div>

                {c.patient && (
                  <div className="patient-section">
                    <div className="patient-info">
                      {c.patient.photo ? (
                        <img src={c.patient.photo} alt="" className="patient-avatar"/>
                      ) : (
                        <div className="patient-avatar" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, hsl(261 47% 58%), hsl(261 57% 52%))', color:'white', fontSize:24, fontWeight:700}}>
                          {c.patient.name?.[0] || '?'}
                        </div>
                      )}
                      <div className="patient-details">
                        <h3>{c.patient.name}</h3>
                        <div className="patient-meta">
                          {c.patient.gender} • {c.patient.age} years • {c.patient.conditionType}
                        </div>
                      </div>
                    </div>
                    
                    {c.chiefComplaint && (
                      <div className="complaint-box">
                        <div className="complaint-label">Chief Complaint</div>
                        <div className="complaint-text">{c.chiefComplaint}</div>
                      </div>
                    )}
                  </div>
                )}

                <div className="card-meta">
                  <div className="meta-item">
                    <span>🕒</span>
                    {new Date(c.createdAt).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn btn-accept" onClick={()=>accept(c.id)}>
                    <span>✓</span> Accept
                  </button>
                  <button className="btn btn-decline" onClick={()=>decline(c.id)}>
                    <span>✕</span> Decline
                  </button>
                </div>
                <button 
                  className="btn btn-details" 
                  onClick={()=>window.location.href=`/doctor/consultations/${c.id}`}
                  style={{marginTop:10, width:'100%'}}
                >
                  👁️ View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

