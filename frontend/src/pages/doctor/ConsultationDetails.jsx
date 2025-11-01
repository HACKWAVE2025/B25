// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import DoctorNav from '../../components/DoctorNav';
// import http from '../../api/http';

// export default function ConsultationDetails() {
//   const { id } = useParams(); // Mongo _id of consultation
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [err, setErr] = useState('');

//   const load = async () => {
//     setErr('');
//     try {
//       const { data } = await http.get(`/doctor/consultations/${id}/details`);
//       setData(data);
//     } catch (e) {
//       setErr(e.response?.data?.message || 'Failed to load');
//     }
//   };

//   useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

//   useEffect(() => {
//   if (!data || data.video?.enabled) return;
//   const t = setInterval(() => load(), 4000);
//   return () => clearInterval(t);
// }, [data]);


//   const accept = async () => {
//     try {
//       await http.patch(`/doctor/consultations/${id}/accept`);
//       navigate('/doctor/in-progress');
//     } catch (e) {
//       alert(e.response?.data?.message || 'Accept failed');
//     }
//   };
//   const decline = async () => {
//     const reason = prompt('Reason for decline?') || 'no reason';
//     try {
//       await http.patch(`/doctor/consultations/${id}/decline`, { reason });
//       navigate('/doctor/queue');
//     } catch (e) {
//       alert(e.response?.data?.message || 'Decline failed');
//     }
//   };

//   return (
//     <div>
//       <DoctorNav />
//       <div style={{ padding:16, maxWidth:1000, margin:'0 auto' }}>
//         <button onClick={()=>navigate(-1)}>&larr; Back</button>
//         <h3 style={{ marginTop:12 }}>Consultation Details</h3>
//         {err && <p>{err}</p>}
//         {!data ? <p>Loading...</p> : (
//           <>
//             <section style={{ marginBottom:16 }}>
//               <h4>Consultation</h4>
//               <div>Id: {data.consultation.consultationId}</div>
//               <div>Chief complaint: {data.consultation.chiefComplaint || '—'}</div>
//               <div>Disease type: {data.consultation.conditionType || data.patient?.conditionType || '—'}</div>
//               <div>Status: {data.consultation.status}</div>
//               <div>Created: {new Date(data.consultation.createdAt).toLocaleString()}</div>
//               {data.consultation.startedAt && <div>Started: {new Date(data.consultation.startedAt).toLocaleString()}</div>}
//             </section>

//             <section style={{ marginBottom:16 }}>
//               <h4>Patient</h4>
//               <div>Name: {data.patient?.name || '—'}</div>
//               <div>Age: {data.patient?.age ?? '—'}</div>
//               <div>Height: {data.patient?.height ?? '—'}</div>
//               <div>Weight: {data.patient?.weight ?? '—'}</div>
//               <div>Gender: {data.patient?.gender || '—'}</div>
//               <div>Phone: {data.patient?.phone || '—'}</div> 
//               <div>Patient ID: {data.patient?.patientId || '—'}</div>
//             </section>

//             {!!(data.patient?.photos?.length) && (
//               <section style={{ marginBottom:16 }}>
//                 <h4>Patient images</h4>
//                 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:10 }}>
//                   {data.patient.photos.map((p, idx)=>(
//                     <img key={idx} src={p.url} alt="patient" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:4 }} />
//                   ))}
//                 </div>
//               </section>
//             )}

//             {!!(data.consultationImages?.length) && (
//               <section style={{ marginBottom:16 }}>
//                 <h4>Consultation images</h4>
//                 <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:10 }}>
//                   {data.consultationImages.map((p, idx)=>(
//                     <img key={idx} src={p.url} alt="consultation" style={{ width:'100%', height:140, objectFit:'cover', borderRadius:4 }} />
//                   ))}
//                 </div>
//               </section>
//             )}

//             <section style={{ marginTop:16, display:'flex', gap:8 }}>
//               {data.consultation.status === 'in_queue' && (
//                 <>
//                   <button onClick={accept}>Accept</button>
//                   <button onClick={decline}>Decline</button>
//                 </>
//               )}
//               {data.consultation.status === 'in_progress' && (
//                 <>
//                   <button onClick={()=>navigate(`/doctor/prescription?ref=${encodeURIComponent(data.consultation.consultationId)}`)}>
//                     Write Rx
//                   </button>
//                   <button onClick={()=>navigate('/doctor/in-progress')}>Go to In Progress</button>
//                 </>
//               )}


//          <button
//            onClick={() => window.location.href = `/video?ref=${encodeURIComponent(data.consultation.consultationId)}`}
//            disabled={!data.video?.enabled}
//            title={!data.video?.enabled ? 'Video not started by nurse yet' : ''}
//          >
//            Join Video
//          </button>



//             </section>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DoctorNav from '../../components/DoctorNav';
import http from '../../api/http';

export default function ConsultationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const load = async () => {
    setErr('');
    try {
      const { data } = await http.get(`/doctor/consultations/${id}/details`);
      setData(data);
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to load');
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  useEffect(() => {
    if (!data || data.video?.enabled) return;
    const t = setInterval(() => load(), 4000);
    return () => clearInterval(t);
  }, [data]);

  const accept = async () => {
    try {
      await http.patch(`/doctor/consultations/${id}/accept`);
      navigate('/doctor/in-progress');
    } catch (e) {
      alert(e.response?.data?.message || 'Accept failed');
    }
  };
  
  const decline = async () => {
    const reason = prompt('Reason for decline?') || 'no reason';
    try {
      await http.patch(`/doctor/consultations/${id}/decline`, { reason });
      navigate('/doctor/queue');
    } catch (e) {
      alert(e.response?.data?.message || 'Decline failed');
    }
  };

  return (
    <div className="details-page">
      <style>{`
        .details-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .details-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .btn-back {
          padding: 10px 20px;
          background: white;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 15px;
          color: hsl(215 25% 27%);
        }
        .btn-back:hover {
          background: hsl(210 40% 98%);
        }
        
        .page-header {
          margin-bottom: 32px;
        }
        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: hsl(215 25% 27%);
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .error-alert {
          background: hsl(4 90% 96%);
          color: hsl(4 90% 50%);
          border: 1px solid hsl(4 90% 86%);
          padding: 16px 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }
        
        .loading {
          text-align: center;
          padding: 60px 20px;
          color: hsl(215 16% 47%);
        }
        
        .hero-section {
          background: linear-gradient(135deg, hsl(261 47% 58%) 0%, hsl(261 57% 52%) 100%);
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          color: white;
        }
        .patient-hero {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 20px;
        }
        .patient-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .patient-info h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }
        .patient-meta {
          display: flex;
          gap: 20px;
          font-size: 16px;
          opacity: 0.95;
        }
        .complaint-highlight {
          padding: 16px 20px;
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
          border-left: 4px solid white;
        }
        .complaint-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
          margin-bottom: 6px;
        }
        .complaint-text {
          font-size: 16px;
          line-height: 1.5;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .card h3 {
          font-size: 18px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .info-grid {
          display: grid;
          gap: 12px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid hsl(214 32% 91%);
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-size: 14px;
          font-weight: 500;
          color: hsl(215 16% 47%);
        }
        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: hsl(215 25% 27%);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }
        .badge-queue {
          background: hsl(212 90% 95%);
          color: hsl(212 90% 45%);
        }
        .badge-progress {
          background: hsl(38 92% 95%);
          color: hsl(38 92% 45%);
        }
        
        .images-gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }
        .gallery-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
          border: 2px solid hsl(214 32% 91%);
        }
        .gallery-image:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }
        
        .action-bar {
          position: sticky;
          bottom: 0;
          background: white;
          padding: 20px 24px;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          gap: 12px;
        }
        .btn {
          flex: 1;
          padding: 14px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
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
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(261 47% 58% / 0.3);
        }
        .btn-success {
          background: hsl(142 76% 36%);
          color: white;
        }
        .btn-success:hover {
          background: hsl(142 76% 30%);
        }
        .btn-danger {
          background: white;
          border: 1px solid hsl(4 90% 70%);
          color: hsl(4 90% 50%);
        }
        .btn-danger:hover {
          background: hsl(4 90% 96%);
        }
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .video-status {
          padding: 12px 16px;
          background: hsl(38 92% 96%);
          border: 1px solid hsl(38 92% 86%);
          border-radius: 10px;
          color: hsl(38 92% 40%);
          font-size: 14px;
          text-align: center;
          margin-top: 12px;
        }
        
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .patient-hero {
            flex-direction: column;
            text-align: center;
          }
          .action-bar {
            flex-direction: column;
          }
        }
      `}</style>
      
      <DoctorNav />
      <div className="details-container">
        <button onClick={()=>navigate(-1)} className="btn-back">← Back</button>
        
        <div className="page-header">
          <h1>
            <span>📋</span>
            Consultation Details
          </h1>
        </div>

        {err && (
          <div className="error-alert">
            <span>⚠</span>
            {err}
          </div>
        )}

        {!data ? (
          <div className="loading">
            <div style={{fontSize:48, marginBottom:16}}>⏳</div>
            <p>Loading consultation details...</p>
          </div>
        ) : (
          <>
            <div className="hero-section">
              {data.patient && (
                <div className="patient-hero">
                  {data.patient.photo ? (
                    <img src={data.patient.photo} alt="" className="patient-avatar-large"/>
                  ) : (
                    <div className="patient-avatar-large" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'white', color:'hsl(261 47% 58%)', fontSize:40, fontWeight:700}}>
                      {data.patient.name?.[0] || '?'}
                    </div>
                  )}
                  <div className="patient-info">
                    <h2>{data.patient.name || 'Unknown Patient'}</h2>
                    <div className="patient-meta">
                      <span>{data.patient.gender || '?'}</span>
                      <span>•</span>
                      <span>{data.patient.age || '?'} years</span>
                      <span>•</span>
                      <span>{data.patient.conditionType || 'General'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {data.consultation.chiefComplaint && (
                <div className="complaint-highlight">
                  <div className="complaint-label">Chief Complaint</div>
                  <div className="complaint-text">{data.consultation.chiefComplaint}</div>
                </div>
              )}
            </div>

            <div className="content-grid">
              <div>
                <div className="card" style={{marginBottom:24}}>
                  <h3>📊 Consultation Information</h3>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Consultation ID</span>
                      <span className="info-value" style={{fontFamily:'monospace'}}>{data.consultation.consultationId}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status</span>
                      <span className={`badge badge-${data.consultation.status === 'in_progress' ? 'progress' : 'queue'}`}>
                        {data.consultation.status}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Condition Type</span>
                      <span className="info-value">{data.consultation.conditionType || data.patient?.conditionType || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Created</span>
                      <span className="info-value">{new Date(data.consultation.createdAt).toLocaleString()}</span>
                    </div>
                    {data.consultation.startedAt && (
                      <div className="info-row">
                        <span className="info-label">Started</span>
                        <span className="info-value">{new Date(data.consultation.startedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {(data.patient?.photos?.length > 0 || data.consultationImages?.length > 0) && (
                  <div className="card">
                    <h3>📸 Patient Images</h3>
                    <div className="images-gallery">
                      {data.patient?.photos?.map((p, idx)=>(
                        <img key={idx} src={p.url} alt="Patient" className="gallery-image"/>
                      ))}
                      {data.consultationImages?.map((p, idx)=>(
                        <img key={idx} src={p.url} alt="Consultation" className="gallery-image"/>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="card">
                  <h3>👤 Patient Details</h3>
                  <div className="info-grid">
                    <div className="info-row">
                      <span className="info-label">Patient ID</span>
                      <span className="info-value" style={{fontFamily:'monospace'}}>{data.patient?.patientId || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Phone</span>
                      <span className="info-value">{data.patient?.phone || '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Height</span>
                      <span className="info-value">{data.patient?.height ? `${data.patient.height} cm` : '—'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Weight</span>
                      <span className="info-value">{data.patient?.weight ? `${data.patient.weight} kg` : '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-bar">
              {data.consultation.status === 'in_queue' && (
                <>
                  <button className="btn btn-success" onClick={accept}>
                    <span>✓</span> Accept Case
                  </button>
                  <button className="btn btn-danger" onClick={decline}>
                    <span>✕</span> Decline
                  </button>
                </>
              )}
              {data.consultation.status === 'in_progress' && (
                <>
                  <button 
                    className="btn btn-primary" 
                    onClick={()=>navigate(`/doctor/prescription?ref=${encodeURIComponent(data.consultation.consultationId)}`)}
                  >
                    <span>📝</span> Write Prescription
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={()=>window.location.href=`/video?ref=${encodeURIComponent(data.consultation.consultationId)}`}
                    disabled={!data.video?.enabled}
                  >
                    <span>📹</span> {data.video?.enabled ? 'Join Video' : 'Video Not Ready'}
                  </button>
                </>
              )}
            </div>
            
            {data.consultation.status === 'in_progress' && !data.video?.enabled && (
              <div className="video-status">
                ⏳ Waiting for nurse to enable video call...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
