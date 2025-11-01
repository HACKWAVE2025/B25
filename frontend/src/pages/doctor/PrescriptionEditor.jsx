// import { useEffect, useState } from 'react';
// import DoctorNav from '../../components/DoctorNav';
// import http from '../../api/http';
// import { useLocation } from 'react-router-dom';

// export default function PrescriptionEditor() {
//   const location = useLocation();
//   const [ref, setRef] = useState('');
//   const [meds, setMeds] = useState([
//     { name:'', dosage:'', frequency:'', duration:'', instructions:'' }
//   ]);
//   const [notes, setNotes] = useState('');
//   const [msg, setMsg] = useState('');

//   const add = () => setMeds([...meds, { name:'', dosage:'', frequency:'', duration:'', instructions:'' }]);
//   const remove = (i) => setMeds(meds.filter((_,idx)=>idx!==i));
//     useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const initialRef = params.get('ref');
//     if (initialRef) setRef(initialRef);
//   }, [location.search]);
//   const save = async () => {
//   setMsg('');
//   try {
//     const payload = {
//       consultationRef: ref.trim(),
//       medications: meds.filter(m=>m.name && m.dosage && m.frequency && m.duration),
//       notes
//     };
//     await http.post('/prescriptions', payload);
//     window.location.href = '/doctor/in-progress'; // redirect after save
//   } catch (e) {
//     setMsg(e.response?.data?.message || 'Failed');
//   }
// };


//   return (
//     <div>
//       <DoctorNav />
//       <div style={{ padding:16 }}>
//         <h3>Prescription</h3>
//         <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:12 }}>
//           <input placeholder="Consultation _id or CON000001" value={ref} onChange={e=>setRef(e.target.value)} style={{ width:320 }}/>
//           <button onClick={save}>Save</button>
//           {msg && <span style={{ marginLeft:8 }}>{msg}</span>}
//         </div>

//         <div style={{ display:'grid', gap:8 }}>
//           {meds.map((m,i)=>(
//             <div key={i} style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1.2fr auto', gap:8 }}>
//               <input placeholder="Medicine" value={m.name} onChange={e=>{ const x=[...meds]; x[i].name=e.target.value; setMeds(x); }} required/>
//               <input placeholder="Dosage" value={m.dosage} onChange={e=>{ const x=[...meds]; x[i].dosage=e.target.value; setMeds(x); }}/>
//               <input placeholder="Frequency" value={m.frequency} onChange={e=>{ const x=[...meds]; x[i].frequency=e.target.value; setMeds(x); }}/>
//               <input placeholder="Duration" value={m.duration} onChange={e=>{ const x=[...meds]; x[i].duration=e.target.value; setMeds(x); }}/>
//               <input placeholder="Instructions" value={m.instructions} onChange={e=>{ const x=[...meds]; x[i].instructions=e.target.value; setMeds(x); }}/>
//               <button onClick={()=>remove(i)}>Remove</button>
//             </div>
//           ))}
//           <button onClick={add}>Add Medicine</button>
//         </div>

//         <div style={{ marginTop:12 }}>
//           <textarea placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} rows={4} style={{ width:'100%', maxWidth:800 }}/>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import DoctorNav from '../../components/DoctorNav';
import http from '../../api/http';
import { useLocation } from 'react-router-dom';

export default function PrescriptionEditor() {
  const location = useLocation();
  const [ref, setRef] = useState('');
  const [meds, setMeds] = useState([
    { name:'', dosage:'', frequency:'', duration:'', instructions:'' }
  ]);
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const add = () => setMeds([...meds, { name:'', dosage:'', frequency:'', duration:'', instructions:'' }]);
  const remove = (i) => setMeds(meds.filter((_,idx)=>idx!==i));
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialRef = params.get('ref');
    if (initialRef) setRef(initialRef);
  }, [location.search]);
  
  const save = async () => {
    setMsg('');
    setSaving(true);
    try {
      const payload = {
        consultationRef: ref.trim(),
        medications: meds.filter(m=>m.name && m.dosage && m.frequency && m.duration),
        notes
      };
      await http.post('/prescriptions', payload);
      setMsg('Prescription saved successfully ✓');
      setTimeout(()=>{
        window.location.href = '/doctor/in-progress';
      }, 1500);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rx-editor-page">
      <style>{`
        .rx-editor-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .rx-editor-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
        .page-header p {
          color: hsl(215 16% 47%);
          font-size: 16px;
          margin: 0;
        }
        
        .rx-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }
        
        .consultation-input-section {
          display: flex;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 32px;
          padding: 24px;
          background: hsl(210 40% 98%);
          border-radius: 12px;
        }
        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: hsl(215 25% 27%);
        }
        .form-group input {
          padding: 12px 16px;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 8px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .form-group input:focus {
          outline: none;
          border-color: hsl(261 47% 58%);
          box-shadow: 0 0 0 3px hsla(261 47% 58% / 0.1);
        }
        
        .btn-save {
          padding: 12px 32px;
          background: linear-gradient(135deg, hsl(261 47% 58%) 0%, hsl(261 57% 52%) 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(261 47% 58% / 0.3);
        }
        .btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .alert {
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 24px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .alert-success {
          background: hsl(142 76% 96%);
          color: hsl(142 76% 36%);
          border: 1px solid hsl(142 76% 86%);
        }
        .alert-error {
          background: hsl(4 90% 96%);
          color: hsl(4 90% 50%);
          border: 1px solid hsl(4 90% 86%);
        }
        
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .section-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-add {
          padding: 10px 20px;
          background: hsl(174 62% 47%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-add:hover {
          background: hsl(174 72% 42%);
        }
        
        .med-cards {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        .med-card {
          padding: 20px;
          background: hsl(210 40% 98%);
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.2s;
        }
        .med-card:hover {
          border-color: hsl(261 47% 58%);
        }
        .med-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .med-number {
          font-size: 18px;
          font-weight: 700;
          color: hsl(261 47% 58%);
        }
        .btn-remove {
          padding: 6px 12px;
          background: hsl(4 90% 96%);
          color: hsl(4 90% 50%);
          border: 1px solid hsl(4 90% 86%);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-remove:hover {
          background: hsl(4 90% 50%);
          color: white;
        }
        .med-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .med-grid input {
          padding: 10px 14px;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 8px;
          font-size: 14px;
          background: white;
          font-family: 'Inter', sans-serif;
          transition: all 0.2s;
        }
        .med-grid input:focus {
          outline: none;
          border-color: hsl(261 47% 58%);
          box-shadow: 0 0 0 3px hsla(261 47% 58% / 0.1);
        }
        .med-instructions {
          grid-column: 1 / -1;
        }
        .med-instructions input {
          width: 100%;
        }
        
        .notes-section textarea {
          width: 100%;
          min-height: 150px;
          padding: 16px;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 12px;
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          resize: vertical;
          transition: all 0.2s;
        }
        .notes-section textarea:focus {
          outline: none;
          border-color: hsl(261 47% 58%);
          box-shadow: 0 0 0 3px hsla(261 47% 58% / 0.1);
        }
        
        .save-bar {
          position: sticky;
          bottom: 0;
          background: white;
          padding: 20px 32px;
          border-radius: 16px 16px 0 0;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .save-bar-info {
          font-size: 14px;
          color: hsl(215 16% 47%);
        }
        
        @media (max-width: 768px) {
          .med-grid {
            grid-template-columns: 1fr;
          }
          .consultation-input-section {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
      
      <DoctorNav />
      <div className="rx-editor-container">
        <div className="page-header">
          <h1>
            <span>💊</span>
            Prescription Editor
          </h1>
          <p>Create a new prescription for consultation</p>
        </div>

        <div className="rx-card">
          <div className="consultation-input-section">
            <div className="form-group">
              <label>Consultation ID / Reference *</label>
              <input 
                placeholder="CON000001 or MongoDB _id" 
                value={ref} 
                onChange={e=>setRef(e.target.value)}
              />
            </div>
            <button onClick={save} className="btn-save" disabled={saving}>
              {saving ? '💾 Saving...' : '💾 Save Prescription'}
            </button>
          </div>

          {msg && (
            <div className={`alert ${msg.includes('✓') || msg.includes('success') ? 'alert-success' : 'alert-error'}`}>
              {msg.includes('✓') || msg.includes('success') ? '✓' : '⚠'} {msg}
            </div>
          )}

          <div className="section-header">
            <h2>💊 Medications</h2>
            <button onClick={add} className="btn-add">+ Add Medicine</button>
          </div>

          <div className="med-cards">
            {meds.map((m, i)=>(
              <div key={i} className="med-card">
                <div className="med-card-header">
                  <div className="med-number">#{i + 1}</div>
                  {meds.length > 1 && (
                    <button onClick={()=>remove(i)} className="btn-remove">✕ Remove</button>
                  )}
                </div>
                <div className="med-grid">
                  <input 
                    placeholder="Medicine name *" 
                    value={m.name} 
                    onChange={e=>{ const x=[...meds]; x[i].name=e.target.value; setMeds(x); }} 
                    required
                  />
                  <input 
                    placeholder="Dosage *" 
                    value={m.dosage} 
                    onChange={e=>{ const x=[...meds]; x[i].dosage=e.target.value; setMeds(x); }}
                  />
                  <input 
                    placeholder="Frequency *" 
                    value={m.frequency} 
                    onChange={e=>{ const x=[...meds]; x[i].frequency=e.target.value; setMeds(x); }}
                  />
                  <input 
                    placeholder="Duration *" 
                    value={m.duration} 
                    onChange={e=>{ const x=[...meds]; x[i].duration=e.target.value; setMeds(x); }}
                  />
                  <div className="med-instructions">
                    <input 
                      placeholder="Special instructions (optional)" 
                      value={m.instructions} 
                      onChange={e=>{ const x=[...meds]; x[i].instructions=e.target.value; setMeds(x); }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-header">
            <h2>📝 Additional Notes</h2>
          </div>
          <div className="notes-section">
            <textarea 
              placeholder="Add any additional instructions, precautions, or notes for the patient..." 
              value={notes} 
              onChange={e=>setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="save-bar">
          <div className="save-bar-info">
            {meds.filter(m=>m.name && m.dosage && m.frequency && m.duration).length} medication(s) ready
          </div>
          <button onClick={save} className="btn-save" disabled={saving}>
            {saving ? '💾 Saving...' : '💾 Save Prescription'}
          </button>
        </div>
      </div>
    </div>
  );
}

