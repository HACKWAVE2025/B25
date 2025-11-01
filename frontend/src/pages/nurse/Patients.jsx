// import { useEffect, useState } from 'react';
// import NurseNav from '../../components/NurseNav';
// import http from '../../api/http';

// export default function Patients() {
//   const [list, setList] = useState([]);
//   const [form, setForm] = useState({
//     firstName:'', lastName:'', age:'', gender:'male', email:'', phone:'',
//     height:'', weight:'', conditionType:'other'
//   });
//   const [files, setFiles] = useState([]);
//   const [msg, setMsg] = useState('');

//   const load = async () => {
//     try {
//       const { data } = await http.get('/nurse/patients');
//       setList(data);
//     } catch { setList([]); }
//   };

//   useEffect(() => { load(); }, []);

//   const onPick = (e) => setFiles(Array.from(e.target.files || []));

//   const create = async (e) => {
//     e.preventDefault();
//     setMsg('');
//     // Local enforcement: require 1 file for skin/wound
//     if ((form.conditionType === 'skin' || form.conditionType === 'wound') && files.length === 0) {
//       setMsg('Please attach at least one image for skin/wound');
//       return;
//     }
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k,v]) => fd.append(k, v));
//       files.forEach(f => fd.append('photos', f));
//       await http.post('/nurse/patients', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
//       setMsg('Patient registered');
//       setForm({ firstName:'', lastName:'', age:'', gender:'male', email:'', phone:'', height:'', weight:'', conditionType:'other' });
//       setFiles([]);
//       load();
//     } catch (e) {
//       setMsg(e.response?.data?.message || 'Failed');
//     }
//   };

//   return (
//     <div>
//       <NurseNav />
//       <div style={{ padding:16 }}>
//         <h3>Patients</h3>

//         <form onSubmit={create} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:900 }}>
//           <input placeholder="First name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})}/>
//           <input placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})}/>
//           <input placeholder="Age" value={form.age} onChange={e=>setForm({...form, age:e.target.value})}/>
//           <select value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}>
//             <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
//           </select>
//           <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
//           <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
//           <input placeholder="Height (cm)" value={form.height} onChange={e=>setForm({...form, height:e.target.value})}/>
//           <input placeholder="Weight (kg)" value={form.weight} onChange={e=>setForm({...form, weight:e.target.value})}/>
//           <select value={form.conditionType} onChange={e=>setForm({...form, conditionType:e.target.value})}>
//             <option value="other">Other</option>
//             <option value="skin">Skin</option>
//             <option value="wound">Wound</option>
//           </select>
//           <input type="file" multiple accept="image/*" onChange={onPick} />
//           <button type="submit" style={{ gridColumn:'1 / span 2' }}>Register</button>
//           {msg && <p>{msg}</p>}
//         </form>

//         <hr />
//         <h3>Registered Patients</h3>
//         <table border="1" cellPadding="6">
//           <thead><tr><th>PID</th><th>Name</th><th>Phone</th><th>Created</th><th>Actions</th></tr></thead>
//           <tbody>
//             {list.map(p => (
//               <tr key={p.id}>
//                 <td>{p.patientId}</td><td>{p.name}</td><td>{p.phone}</td><td>{new Date(p.createdAt).toLocaleString()}</td><td>
//                   <a
//                     href={`/nurse/patient/edit?ref=${encodeURIComponent(p.patientId || p.id)}`}
//                   > Edit
//                   </a>
//                 </td>
//               </tr>
//             ))}
//             {list.length===0 && <tr><td colSpan="4">No patients</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import NurseNav from '../../components/NurseNav';
import { useNavigate } from 'react-router-dom';
import http from '../../api/http';

export default function Patients() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    firstName:'', lastName:'', age:'', gender:'male', email:'', phone:'',
    height:'', weight:'', conditionType:'other'
  });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState('');

  const load = async () => {
  try {
    const { data } = await http.get('/nurse/patients');
    const normalized = (data || []).map(d => {
      const id = d.id || d._id;
      const personal = d.personalInfo || {};
      const fullName = d.name || '';
      const [firstFromName, ...restLast] = fullName.split(' ').filter(Boolean);
      const firstName = personal.firstName || firstFromName || '';
      const lastName = personal.lastName || (restLast.length ? restLast.join(' ') : '');
      const phone = personal.phone || d.phone || '';
      const age = personal.age ?? null;
      const gender = personal.gender || '';
      const photo = (Array.isArray(d.photos) && d.photos[0]?.url) || personal.photo || '';
      const aiTargetFor = (p) => {
  const ref = encodeURIComponent(p.patientId || p.id);
  const t = (p.conditionType || 'other').toLowerCase();
  if (t === 'skin') return `/ai/skin?ref=${ref}`;
  if (t === 'wound') return `/ai/wound?ref=${ref}`;
  return `/ai/rural?ref=${ref}`;
};

      return {
        id,
        patientId: d.patientId,
        firstName,
        lastName,
        phone,
        age,
        gender,
        conditionType: d.conditionType || 'other',
        photo,
        createdAt: d.createdAt
      };
    });
    setList(normalized);
  } catch {
    setList([]);
  }
};


  useEffect(() => { load(); }, []);

  const onPick = (e) => setFiles(Array.from(e.target.files || []));

  const create = async (e) => {
    e.preventDefault();
    setMsg('');
    if ((form.conditionType === 'skin' || form.conditionType === 'wound') && files.length === 0) {
      setMsg('Please attach at least one image for skin/wound');
      return;
    }
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      files.forEach(f => fd.append('photos', f));
      await http.post('/nurse/patients', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg('Patient registered successfully ✓');
      setForm({ firstName:'', lastName:'', age:'', gender:'male', email:'', phone:'', height:'', weight:'', conditionType:'other' });
      setFiles([]);
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed');
    }
  };
  const navigate = useNavigate();
  return (
    <div className="patients-page">
      <style>{`
        .patients-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .patients-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          animation: fadeInUp 0.5s ease-out;
        }
        .patients-header {
          margin-bottom: 32px;
        }
        .patients-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: hsl(215 25% 27%);
          margin: 0 0 8px 0;
        }
        .patients-header p {
          color: hsl(215 16% 47%);
          font-size: 16px;
          margin: 0;
        }
        
        .patients-form-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 32px;
        }
        .patients-form-card h2 {
          font-size: 20px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 14px;
          font-weight: 500;
          color: hsl(215 25% 27%);
        }
        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: hsl(174 62% 47%);
          box-shadow: 0 0 0 3px hsla(174 62% 47% / 0.1);
        }
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        .file-upload-zone {
          grid-column: 1 / -1;
          border: 2px dashed hsl(214 32% 91%);
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          background: hsl(210 40% 98%);
          transition: all 0.3s;
          cursor: pointer;
        }
        .file-upload-zone:hover {
          border-color: hsl(174 62% 47%);
          background: hsl(174 62% 97%);
        }
        .file-upload-zone.has-files {
          border-color: hsl(174 62% 47%);
          background: hsl(174 62% 97%);
        }
        .upload-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }
        .file-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
        }
        .file-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 8px;
          font-size: 14px;
        }
        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, hsl(174 62% 47%) 0%, hsl(174 72% 42%) 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(174 62% 47% / 0.3);
        }
        .btn-primary:active {
          transform: translateY(0);
        }
        .alert {
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 20px;
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
        
        .patients-table-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .patients-table-card h2 {
          font-size: 20px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          margin: 0 0 24px 0;
        }
        .patients-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .patients-table thead th {
          background: hsl(210 40% 98%);
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          color: hsl(215 25% 27%);
          border-bottom: 2px solid hsl(214 32% 91%);
        }
        .patients-table thead th:first-child {
          border-top-left-radius: 10px;
        }
        .patients-table thead th:last-child {
          border-top-right-radius: 10px;
        }
        .patients-table tbody td {
          padding: 18px 16px;
          border-bottom: 1px solid hsl(214 32% 91%);
          font-size: 15px;
        }
        .patients-table tbody tr {
          transition: background 0.2s;
        }
        .patients-table tbody tr:hover {
          background: hsl(210 40% 98%);
        }
        .patient-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid hsl(214 32% 91%);
        }
        .patient-name {
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
        .badge-condition {
          background: hsl(212 90% 95%);
          color: hsl(212 90% 45%);
        }
        .btn-icon {
          padding: 8px 16px;
          background: white;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: hsl(215 25% 27%);
        }
        .btn-icon:hover {
          background: hsl(210 40% 98%);
          border-color: hsl(174 62% 47%);
          color: hsl(174 62% 47%);
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: hsl(215 16% 47%);
        }
        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .patients-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
      
      <NurseNav />
      <div className="patients-container">
        <div className="patients-header">
          <h1>👥 Patient Registry</h1>
          <p>Register and manage patient information</p>
        </div>

        <div className="patients-form-card">
          <h2>📋 Register New Patient</h2>
          {msg && (
            <div className={`alert ${msg.includes('success') || msg.includes('✓') ? 'alert-success' : 'alert-error'}`}>
              <span>{msg.includes('success') || msg.includes('✓') ? '✓' : '⚠'}</span>
              {msg}
            </div>
          )}
          <form onSubmit={create}>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input placeholder="Enter first name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} required/>
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input placeholder="Enter last name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} required/>
              </div>
              <div className="form-group">
                <label>Age</label>
                <input placeholder="Age" type="number" value={form.age} onChange={e=>setForm({...form, age:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input placeholder="email@example.com" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input placeholder="+91 XXXXXXXXXX" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input placeholder="170" type="number" value={form.height} onChange={e=>setForm({...form, height:e.target.value})}/>
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input placeholder="70" type="number" value={form.weight} onChange={e=>setForm({...form, weight:e.target.value})}/>
              </div>
              <div className="form-group full-width">
                <label>Condition Type *</label>
                <select value={form.conditionType} onChange={e=>setForm({...form, conditionType:e.target.value})}>
                  <option value="other">Other</option>
                  <option value="skin">Skin</option>
                  <option value="wound">Wound</option>
                </select>
                {(form.conditionType === 'skin' || form.conditionType === 'wound') && (
                  <p style={{margin:'6px 0 0 0', fontSize:13, color:'hsl(4 90% 50%)'}}>⚠ Image required for skin/wound conditions</p>
                )}
              </div>
              
              <div className={`file-upload-zone ${files.length > 0 ? 'has-files' : ''}`} onClick={()=>document.getElementById('file-input').click()}>
                <input id="file-input" type="file" multiple accept="image/*" onChange={onPick} style={{display:'none'}}/>
                <div className="upload-icon">📷</div>
                <div style={{fontSize:16, fontWeight:500, marginBottom:6}}>
                  {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload patient images'}
                </div>
                <div style={{fontSize:14, color:'hsl(215 16% 47%)'}}>
                  Supports JPG, PNG, HEIC (Required for skin/wound)
                </div>
                {files.length > 0 && (
                  <div className="file-list">
                    {files.map((f, i) => (
                      <div key={i} className="file-item">📎 {f.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <button type="submit" className="btn-primary">
              <span>✓</span> Register Patient
            </button>
          </form>
        </div>

        <div className="patients-table-card">
          <h2>📊 Registered Patients ({list.length})</h2>
          {list.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👤</div>
              <h3>No patients registered yet</h3>
              <p>Start by registering your first patient above</p>
            </div>
          ) : (
            <table className="patients-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>ID</th>
                  <th>Contact</th>
                  <th>Age/Gender</th>
                  <th>Condition</th>
                  <th>Actions</th>
                  <th>AI-Assistance</th>

                </tr>
              </thead>
              <tbody>
                {list.map(p=>(
                  <tr key={p.id || p.patientId}>
                    <td>
                      <div style={{display:'flex', alignItems:'center', gap:12}}>
                        {p.photo ? (
                          <img src={p.photo} alt="" className="patient-avatar"/>
                        ) : (
                          <div className="patient-avatar" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'hsl(174 62% 95%)', color:'hsl(174 62% 47%)', fontWeight:600}}>
                            {p.firstName?.[0]}{p.lastName?.[0]}
                          </div>
                        )}
                        <div className="patient-name">
                          {p.firstName} {p.lastName}
                        </div>
                      </div>
                    </td>
                    <td style={{fontFamily:'monospace', fontSize:14}}>{p.patientId}</td>
                    <td>{p.phone || '—'}</td>
                    <td>{p.age || '?'} • {p.gender || '?'}</td>
                    <td>
                      <span className="badge badge-condition">
                        {p.conditionType || 'other'}
                      </span>
                    </td>
                    <td>
  <button
    className="btn-icon"
    onClick={() => navigate(`/nurse/patient/edit?ref=${encodeURIComponent(p.patientId || p.id)}`)}
  >
    ✏️ Edit
  </button>
</td>
<td>
 <a className="btn-icon" href={
  ((p.conditionType || 'other').toLowerCase() === 'skin')
    ? `/ai/skin?ref=${encodeURIComponent(p.patientId || p.id)}`
    : ((p.conditionType || 'other').toLowerCase() === 'wound')
      ? `/ai/wound?ref=${encodeURIComponent(p.patientId || p.id)}`
      : `/ai/rural?ref=${encodeURIComponent(p.patientId || p.id)}`
} style={{textDecoration: 'none'}}
>🤖 Assist</a>

</td>


                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

