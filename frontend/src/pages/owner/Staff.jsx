// // src/pages/owner/Staff.jsx
// import { useEffect, useState } from 'react';
// import OwnerNav from '../../components/OwnerNav';
// import http from '../../api/http';

// export default function Staff() {
//   const [list, setList] = useState([]);
//   const [form, setForm] = useState({
//     role: 'nurse',
//     email: '',
//     tempPassword: 'Pass@12345',
//     firstName: '',
//     lastName: '',
//     phone: '',
//     qualification: '',
//     specialization: '',
//     regNo: '' // new: doctor reg no
//   });
//   const [signatureFile, setSignatureFile] = useState(null);      // new: file state
//   const [signaturePreview, setSignaturePreview] = useState('');  // new: preview
//   const [msg, setMsg] = useState('');

//   const load = async () => {
//     try {
//       const { data } = await http.get('/hospital/users');
//       setList(data);
//     } catch (e) { setList([]); }
//   };
//   useEffect(() => { load(); }, []);

//   const createUser = async (e) => {
//     e.preventDefault();
//     setMsg('');
//     try {
//       // If doctor, send multipart with signature; else send JSON
//       if (form.role === 'doctor') {
//         const fd = new FormData();
//         Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//         if (signatureFile) fd.append('signature', signatureFile);
//         await http.post('/hospital/users', fd);

//       } else {
//         await http.post('/hospital/users', form);
//       }
//       setMsg('User created');
//       setForm({
//         role: 'nurse',
//         email: '',
//         tempPassword: 'Pass@12345',
//         firstName: '',
//         lastName: '',
//         phone: '',
//         qualification: '',
//         specialization: '',
//         regNo: ''
//       });
//       setSignatureFile(null);
//       setSignaturePreview('');
//       load();
//     } catch (e) {
//       setMsg(e.response?.data?.message || 'Failed to create user');
//     }
//   };

//   const toggle = async (id, isActive) => {
//     try {
//       await http.patch(`/hospital/users/${id}/status`, { isActive });
//       load();
//     } catch {}
//   };

//   const remove = async (id) => {         // new: delete
//     if (!window.confirm('Delete this account? This cannot be undone.')) return;
//     try {
//       await http.delete(`/hospital/users/${id}`);
//       load();
//     } catch (e) {
//       alert(e.response?.data?.message || 'Delete failed');
//     }
//   };

//   const onSignatureChange = (e) => {      // new: file change handler
//     const f = e.target.files?.[0] || null;
//     setSignatureFile(f);
//     if (f) {
//       const url = URL.createObjectURL(f);
//       setSignaturePreview(url);
//     } else {
//       setSignaturePreview('');
//     }
//   };

//   return (
//     <div>
//       <OwnerNav />
//       <div style={{ padding:16 }}>
//         <h3>Staff</h3>

//         <form onSubmit={createUser} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:900 }}>
//           <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
//             <option value="nurse">Nurse</option>
//             <option value="doctor">Doctor</option>
//           </select>
//           <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
//           <input placeholder="Temp password" value={form.tempPassword} onChange={e=>setForm({...form, tempPassword:e.target.value})} />
//           <input placeholder="First name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} />
//           <input placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} />
//           <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
//           <input placeholder="Qualification (doctor)" value={form.qualification} onChange={e=>setForm({...form, qualification:e.target.value})} />
//           <input placeholder="Specialization (doctor)" value={form.specialization} onChange={e=>setForm({...form, specialization:e.target.value})} />

//           {form.role === 'doctor' && (
//             <>
//               <input placeholder="Registration No" value={form.regNo} onChange={e=>setForm({...form, regNo:e.target.value})} />
//               <div style={{ gridColumn:'1 / span 2' }}>
//                 <label>Signature (JPG): </label>
//                 <input type="file" accept="image/jpeg" onChange={onSignatureChange} />
//                 {signaturePreview && (
//                   <div style={{ marginTop:8 }}>
//                     <img src={signaturePreview} alt="signature preview" style={{ height:60 }} />
//                   </div>
//                 )}
//               </div>
//             </>
//           )}

//           <button type="submit" style={{ gridColumn:'1 / span 2' }}>Create User</button>
//           {msg && <p style={{ gridColumn:'1 / span 2' }}>{msg}</p>}
//         </form>

//         <hr />

//         <table border="1" cellPadding="6" style={{ width:'100%', maxWidth:1000 }}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Email</th>
//               <th>Status</th>
//               <th>Created</th>
//               <th>Actions</th> {/* renamed */}
//             </tr>
//           </thead>
//           <tbody>
//             {list.map(u => (
//               <tr key={u.id}>
//                 <td>{u.name}</td>
//                 <td>{u.role}</td>
//                 <td>{u.email}</td>
//                 <td>{u.isActive ? 'active' : 'suspended'}</td>
//                 <td>{new Date(u.createdAt).toLocaleString()}</td>
//                 <td>
//                   {u.isActive
//                     ? <button onClick={()=>toggle(u.id, false)}>Suspend</button>
//                     : <button onClick={()=>toggle(u.id, true)}>Activate</button>}
//                   <button onClick={()=>remove(u.id)} style={{ marginLeft: 8, color: 'red' }}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//             {list.length === 0 && <tr><td colSpan="6">No staff yet</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import OwnerNav from '../../components/OwnerNav';
import http from '../../api/http';

export default function Staff() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    role: 'nurse',
    email: '',
    tempPassword: 'Pass@12345',
    firstName: '',
    lastName: '',
    phone: '',
    qualification: '',
    specialization: '',
    regNo: ''
  });
  const [signatureFile, setSignatureFile] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await http.get('/hospital/users');
      setList(data);
    } catch (e) { setList([]); }
  };
  
  useEffect(() => { load(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      if (form.role === 'doctor') {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (signatureFile) fd.append('signature', signatureFile);
        await http.post('/hospital/users', fd);
      } else {
        await http.post('/hospital/users', form);
      }
      setMsg('✅ User created successfully');
      setForm({
        role: 'nurse', email: '', tempPassword: 'Pass@12345', firstName: '',
        lastName: '', phone: '', qualification: '', specialization: '', regNo: ''
      });
      setSignatureFile(null);
      setSignaturePreview('');
      load();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.message || 'Failed to create user'));
    } finally {
      setLoading(false);
    }
  };

  const toggle = async (id, isActive) => {
    try {
      await http.patch(`/hospital/users/${id}/status`, { isActive });
      load();
    } catch {}
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this account? This cannot be undone.')) return;
    try {
      await http.delete(`/hospital/users/${id}`);
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Delete failed');
    }
  };

  const onSignatureChange = (e) => {
    const f = e.target.files?.[0] || null;
    setSignatureFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setSignaturePreview(url);
    } else {
      setSignaturePreview('');
    }
  };

  return (
    <>
      <style>{`
        .staff-page {
          min-height: 100vh;
          background: var(--color-gray-50);
        }
        
        .staff-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 48px 24px;
        }
        
        .page-header {
          margin-bottom: 40px;
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
        
        .form-card {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          margin-bottom: 32px;
        }
        
        .form-section-title {
          font-size: 20px;
          font-weight: 600;
          color: var(--color-gray-700);
          margin-bottom: 24px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-label {
          font-weight: 500;
          color: var(--color-gray-600);
          font-size: 14px;
        }
        
        .form-input, .form-select {
          padding: 12px 16px;
          border: 2px solid var(--color-gray-100);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: var(--color-gray-50);
        }
        
        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: var(--color-gray-600);
          background: white;
        }
        
        .signature-upload {
          grid-column: 1 / -1;
          padding: 24px;
          border: 2px dashed var(--color-gray-200);
          border-radius: 12px;
          background: var(--color-gray-50);
          text-align: center;
        }
        
        .signature-preview {
          margin-top: 16px;
          display: inline-block;
        }
        
        .signature-preview img {
          max-height: 80px;
          border: 2px solid var(--color-gray-200);
          border-radius: 8px;
        }
        
        .submit-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #455A64 0%, #546E7A 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(69,90,100,0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
        }
        
        .message {
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
        }
        
        .message.success {
          background: #E8F5E9;
          color: #2E7D32;
        }
        
        .message.error {
          background: #FFEBEE;
          color: #C62828;
        }
        
        .table-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        
        .table-header {
          padding: 24px 32px;
          border-bottom: 1px solid var(--color-gray-100);
        }
        
        .table-title {
          font-size: 20px;
          font-weight: 600;
        }
        
        .staff-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .staff-table th {
          background: var(--color-gray-50);
          padding: 16px 24px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          text-transform: uppercase;
        }
        
        .staff-table td {
          padding: 20px 24px;
          border-top: 1px solid var(--color-gray-100);
          font-size: 14px;
        }
        
        .staff-table tbody tr:hover {
          background: var(--color-gray-50);
        }
        
        .role-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .role-badge.nurse {
          background: #E0F7FA;
          color: #00838F;
        }
        
        .role-badge.doctor {
          background: #EDE7F6;
          color: #6A1B9A;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .status-badge.active {
          background: #E8F5E9;
          color: #2E7D32;
        }
        
        .status-badge.suspended {
          background: #FFF3E0;
          color: #E65100;
        }
        
        .action-btn-group {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 13px;
        }
        
        .action-btn.suspend {
          background: var(--color-warning);
          color: white;
        }
        
        .action-btn.activate {
          background: var(--color-success);
          color: white;
        }
        
        .action-btn.delete {
          background: var(--color-danger);
          color: white;
        }
        
        .action-btn:hover {
          transform: translateY(-1px);
        }
        
        .empty-state {
          padding: 80px 20px;
          text-align: center;
        }
      `}</style>
      
      <div className="staff-page">
        <OwnerNav />
        
        <div className="staff-container">
          <div className="page-header">
            <h1 className="page-title">Staff Management</h1>
            <p className="page-subtitle">Create and manage nurse and doctor accounts</p>
          </div>
          
          <div className="form-card">
            <h3 className="form-section-title">➕ Create New Staff Member</h3>
            
            <form onSubmit={createUser}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
                    <option value="nurse">👩‍⚕️ Nurse</option>
                    <option value="doctor">👨‍⚕️ Doctor</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" placeholder="Email address" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input className="form-input" placeholder="Default: Pass@12345" value={form.tempPassword} onChange={e=>setForm({...form, tempPassword:e.target.value})}/>
                </div>
                
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input className="form-input" placeholder="First name" value={form.firstName} onChange={e=>setForm({...form, firstName:e.target.value})} required/>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form, lastName:e.target.value})} required/>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-input" placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} required/>
                </div>
                
                {form.role === 'doctor' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Qualification</label>
                      <input className="form-input" placeholder="MBBS, MD, etc." value={form.qualification} onChange={e=>setForm({...form, qualification:e.target.value})}/>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Specialization</label>
                      <input className="form-input" placeholder="Dermatology, etc." value={form.specialization} onChange={e=>setForm({...form, specialization:e.target.value})}/>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Registration No</label>
                      <input className="form-input" placeholder="Medical registration number" value={form.regNo} onChange={e=>setForm({...form, regNo:e.target.value})}/>
                    </div>
                    
                    <div className="signature-upload">
                      <label style={{fontWeight: 600, display: 'block', marginBottom: 8}}>📝 Doctor Signature (JPG)</label>
                      <input type="file" accept="image/jpeg" onChange={onSignatureChange} />
                      {signaturePreview && (
                        <div className="signature-preview">
                          <img src={signaturePreview} alt="signature preview" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating...' : '✓ Create Staff Member'}
              </button>
              
              {msg && (
                <div className={`message ${msg.includes('✅') ? 'success' : 'error'}`}>
                  {msg}
                </div>
              )}
            </form>
          </div>
          
          <div className="table-card">
            <div className="table-header">
              <h3 className="table-title">All Staff Members</h3>
            </div>
            
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(u => (
                  <tr key={u.id}>
                    <td style={{fontWeight: 600}}>{u.name}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role === 'nurse' ? '👩‍⚕️ Nurse' : '👨‍⚕️ Doctor'}
                      </span>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-badge ${u.isActive ? 'active' : 'suspended'}`}>
                        {u.isActive ? '✓ Active' : '⏸ Suspended'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btn-group">
                        {u.isActive ? (
                          <button onClick={()=>toggle(u.id, false)} className="action-btn suspend">Suspend</button>
                        ) : (
                          <button onClick={()=>toggle(u.id, true)} className="action-btn activate">Activate</button>
                        )}
                        <button onClick={()=>remove(u.id)} className="action-btn delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan="6">
                      <div className="empty-state">
                        <div style={{fontSize: 64, marginBottom: 16}}>👥</div>
                        <div>No staff members yet</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

