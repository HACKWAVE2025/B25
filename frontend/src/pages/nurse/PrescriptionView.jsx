// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import NurseNav from '../../components/NurseNav';
// import http from '../../api/http';

// export default function PrescriptionView() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [rx, setRx] = useState(null);
//   const [err, setErr] = useState('');

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const ref = params.get('ref'); // consultation _id or CON000xxx
//     if (!ref) { setErr('Missing consultation reference'); return; }
//     (async () => {
//       try {
//         const { data } = await http.get(`/prescriptions/by-consultation/${encodeURIComponent(ref)}`);
//         setRx(data);
//       } catch (e) {
//         setErr(e.response?.data?.message || 'Prescription not found');
//       }
//     })();
//   }, [location.search]);

//   return (
//     <div>
//       <NurseNav />
//       <div style={{ padding:16, maxWidth:900, margin:'0 auto' }}>
//         <button onClick={()=>navigate(-1)}>&larr; Back</button>
//         <h3 style={{ marginTop:12 }}>Prescription</h3>
//         {err && <p>{err}</p>}
//         {!rx ? (!err && <p>Loading...</p>) : (
//           <>
//             <div style={{ marginBottom:12 }}>
//               <div><strong>Consultation</strong>: {rx.consultationIdHuman || rx.consultationId || '—'}</div>
//               <div><strong>Doctor</strong>: {rx.digitalSignature?.doctorName || '—'}</div>
//               <div><strong>Qualification</strong>: {rx.digitalSignature?.qualification || '—'}</div>
//               <div><strong>Signed</strong>: {rx.digitalSignature?.signedAt ? new Date(rx.digitalSignature.signedAt).toLocaleString() : '—'}</div>
//             </div>

//             <div style={{ marginBottom:12 }}>
//               <h4 style={{ margin:'8px 0' }}>Medicines</h4>
//               <table border="1" cellPadding="6" style={{ width:'100%' }}>
//                 <thead>
//                   <tr>
//                     <th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(rx.medications || []).map((m, i)=>(
//                     <tr key={i}>
//                       <td>{m.name}</td>
//                       <td>{m.dosage}</td>
//                       <td>{m.frequency}</td>
//                       <td>{m.duration}</td>
//                       <td>{m.instructions || '—'}</td>
//                     </tr>
//                   ))}
//                   {(!rx.medications || rx.medications.length===0) && (
//                     <tr><td colSpan="5">No medicines</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div>
//               <h4 style={{ margin:'8px 0' }}>Notes</h4>
//               <div style={{
//                 border:'1px solid #ddd', padding:8, minHeight:60, background:'#fafafa', whiteSpace:'pre-wrap'
//               }}>
//                 {rx.notes || '—'}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NurseNav from '../../components/NurseNav';
import http from '../../api/http';

export default function PrescriptionView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [rx, setRx] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (!ref) { setErr('Missing consultation reference'); return; }
    (async () => {
      try {
        const { data } = await http.get(`/prescriptions/by-consultation/${encodeURIComponent(ref)}`);
        setRx(data);
      } catch (e) {
        setErr(e.response?.data?.message || 'Prescription not found');
      }
    })();
  }, [location.search]);

  const printPrescription = () => {
    window.print();
  };

  return (
    <div className="prescription-page">
      <style>{`
        .prescription-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .prescription-container {
          padding: 24px;
          max-width: 1000px;
          margin: 0 auto;
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
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
        .btn-print {
          padding: 12px 24px;
          background: hsl(212 90% 48%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-print:hover {
          background: hsl(212 90% 42%);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(212 90% 48% / 0.3);
        }
        
        .rx-card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .rx-header {
          border-bottom: 3px solid hsl(174 62% 47%);
          padding-bottom: 24px;
          margin-bottom: 32px;
        }
        .rx-header h1 {
          font-size: 28px;
          font-weight: 700;
          color: hsl(215 25% 27%);
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .rx-header p {
          color: hsl(215 16% 47%);
          margin: 0;
        }
        
        .rx-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          padding: 24px;
          background: hsl(210 40% 98%);
          border-radius: 12px;
          margin-bottom: 32px;
        }
        .rx-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .rx-info-label {
          font-size: 13px;
          font-weight: 600;
          color: hsl(215 16% 47%);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .rx-info-value {
          font-size: 15px;
          color: hsl(215 25% 27%);
          font-weight: 500;
        }
        
        .rx-section {
          margin-bottom: 32px;
        }
        .rx-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .meds-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 10px;
          overflow: hidden;
        }
        .meds-table thead th {
          background: hsl(174 62% 47%);
          color: white;
          padding: 14px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        .meds-table tbody td {
          padding: 14px;
          border-bottom: 1px solid hsl(214 32% 91%);
          font-size: 15px;
        }
        .meds-table tbody tr:last-child td {
          border-bottom: none;
        }
        .meds-table tbody tr:hover {
          background: hsl(210 40% 98%);
        }
        
        .rx-notes {
          padding: 20px;
          background: hsl(38 92% 97%);
          border-left: 4px solid hsl(38 92% 50%);
          border-radius: 8px;
          font-size: 15px;
          line-height: 1.6;
          color: hsl(215 25% 27%);
        }
        
        .rx-footer {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid hsl(214 32% 91%);
          font-size: 13px;
          color: hsl(215 16% 47%);
          text-align: center;
        }
        
        .error-message {
          background: hsl(4 90% 96%);
          color: hsl(4 90% 50%);
          border: 1px solid hsl(4 90% 86%);
          padding: 16px 20px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .loading {
          text-align: center;
          padding: 40px;
          color: hsl(215 16% 47%);
        }
        
        @media print {
          .prescription-page {
            background: white;
          }
          .page-actions {
            display: none;
          }
          .rx-card {
            box-shadow: none;
            padding: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .rx-info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      
      <div className="no-print">
        <NurseNav />
      </div>
      
      <div className="prescription-container">
        <div className="page-actions no-print">
          <button className="btn-back" onClick={()=>navigate(-1)}>
            ← Back
          </button>
          {rx && (
            <button className="btn-print" onClick={printPrescription}>
              🖨️ Print Prescription
            </button>
          )}
        </div>

        {err && (
          <div className="error-message">
            <span>⚠</span>
            {err}
          </div>
        )}

        {!rx && !err && (
          <div className="loading">
            <div style={{fontSize:48, marginBottom:16}}>⏳</div>
            <p>Loading prescription...</p>
          </div>
        )}

        {rx && (
          <div className="rx-card">
            <div className="rx-header">
              <h1>
                <span>💊</span>
                Medical Prescription
              </h1>
              <p>Official prescription document for patient treatment</p>
            </div>

            <div className="rx-info-grid">
              <div className="rx-info-item">
                <div className="rx-info-label">Consultation ID</div>
                <div className="rx-info-value" style={{fontFamily:'monospace'}}>
                  {rx.consultationIdHuman || rx.consultationId || '—'}
                </div>
              </div>
              <div className="rx-info-item">
                <div className="rx-info-label">Doctor</div>
                <div className="rx-info-value">{rx.digitalSignature?.doctorName || '—'}</div>
              </div>
              <div className="rx-info-item">
                <div className="rx-info-label">Qualification</div>
                <div className="rx-info-value">{rx.digitalSignature?.qualification || '—'}</div>
              </div>
              <div className="rx-info-item">
                <div className="rx-info-label">Date Signed</div>
                <div className="rx-info-value">
                  {rx.digitalSignature?.signedAt ? new Date(rx.digitalSignature.signedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : '—'}
                </div>
              </div>
            </div>

            <div className="rx-section">
              <h2>💊 Prescribed Medications</h2>
              {(!rx.medications || rx.medications.length === 0) ? (
                <p style={{color:'hsl(215 16% 47%)'}}>No medications prescribed</p>
              ) : (
                <table className="meds-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Instructions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medications.map((m, i)=>(
                      <tr key={i}>
                        <td style={{fontWeight:600}}>{i + 1}</td>
                        <td style={{fontWeight:600, color:'hsl(215 25% 27%)'}}>{m.name}</td>
                        <td>{m.dosage}</td>
                        <td>{m.frequency}</td>
                        <td>{m.duration}</td>
                        <td>{m.instructions || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {rx.notes && (
              <div className="rx-section">
                <h2>📝 Additional Notes</h2>
                <div className="rx-notes">
                  {rx.notes}
                </div>
              </div>
            )}

            {rx.digitalSignature?.signatureUrl && (
              <div className="rx-section">
                <h2>✍️ Doctor's Signature</h2>
                <img 
                  src={rx.digitalSignature.signatureUrl} 
                  alt="Doctor signature" 
                  style={{maxWidth:200, height:'auto', border:'1px solid hsl(214 32% 91%)', borderRadius:8}}
                />
              </div>
            )}

            <div className="rx-footer">
              <p><strong>AyuSahayak Healthcare Platform</strong></p>
              <p>This is a computer-generated prescription and is valid with or without a physical signature.</p>
              <p>For any queries, please contact your healthcare provider.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

