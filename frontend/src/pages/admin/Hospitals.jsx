// import { useEffect, useState } from 'react';
// import AdminNav from '../../components/AdminNav';
// import http from '../../api/http';

// export default function Hospitals() {
//   const [list, setList] = useState([]);
//   const [form, setForm] = useState({
//     name: '',
//     ownerFirstName: '',
//     ownerLastName: '',
//     ownerPhone: '',
//     ownerEmail: '',
//     tempPassword: '',
//     paymentRequiredBeforeConsult: true,
//     city: '',
//     state: 'Telangana',
//     pincode: '',
//   });
//   const [msg, setMsg] = useState('');

//   const load = async () => {
//     try {
//       const { data } = await http.get('/admin/hospitals'); // we will add this route now
//       setList(data || []);
//     } catch (e) {
//       setList([]);
//     }
//   };

//   useEffect(() => { load(); }, []);

//   const create = async (e) => {
//     e.preventDefault();
//     setMsg('');
//     try {
//       await http.post('/admin/hospitals', {
//         name: form.name,
//         owner: {
//           firstName: form.ownerFirstName,
//           lastName: form.ownerLastName,
//           phone: form.ownerPhone,
//           email: form.ownerEmail,
//         },
//         address: { city: form.city, state: form.state, pincode: form.pincode },
//         paymentRequiredBeforeConsult: form.paymentRequiredBeforeConsult,
//         tempPassword: form.tempPassword || 'Owner@12345',
//       });
//       setMsg('Hospital created');
//       setForm({
//         name: '', ownerFirstName:'', ownerLastName:'', ownerPhone:'', ownerEmail:'',
//         tempPassword:'', paymentRequiredBeforeConsult:true, city:'', state:'Telangana', pincode:''
//       });
//       load();
//     } catch (e) {
//       setMsg(e.response?.data?.message || 'Failed to create hospital');
//     }
//   };

//   const toggleStatus = async (id, status) => {
//     try {
//       await http.patch(`/admin/hospitals/${id}/status`, { status });
//       load();
//     } catch {}
//   };

//   return (
//     <div>
//       <AdminNav />
//       <div style={{ padding:16 }}>
//         <h3>Hospitals</h3>

//         <form onSubmit={create} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:900 }}>
//           <input placeholder="Hospital name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
//           <input placeholder="Owner first name" value={form.ownerFirstName} onChange={e=>setForm({...form, ownerFirstName:e.target.value})} />
//           <input placeholder="Owner last name" value={form.ownerLastName} onChange={e=>setForm({...form, ownerLastName:e.target.value})} />
//           <input placeholder="Owner phone" value={form.ownerPhone} onChange={e=>setForm({...form, ownerPhone:e.target.value})} />
//           <input placeholder="Owner email" value={form.ownerEmail} onChange={e=>setForm({...form, ownerEmail:e.target.value})} />
//           <input placeholder="Temp password" value={form.tempPassword} onChange={e=>setForm({...form, tempPassword:e.target.value})} />
//           <input placeholder="City" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
//           <input placeholder="State" value={form.state} onChange={e=>setForm({...form, state:e.target.value})} />
//           <input placeholder="Pincode" value={form.pincode} onChange={e=>setForm({...form, pincode:e.target.value})} />
//           <label style={{ display:'flex', alignItems:'center', gap:8 }}>
//             <input type="checkbox" checked={form.paymentRequiredBeforeConsult}
//               onChange={e=>setForm({...form, paymentRequiredBeforeConsult:e.target.checked})} />
//             Payment before consultation
//           </label>
//           <button type="submit" style={{ gridColumn:'1 / span 2' }}>Create Hospital</button>
//           {msg && <p>{msg}</p>}
//         </form>

//         <hr />

//         <table border="1" cellPadding="6">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Owner</th>
//               <th>Status</th>
//               <th>Created</th>
//               <th>Toggle</th>
//             </tr>
//           </thead>
//           <tbody>
//             {list.map(h => (
//               <tr key={h._id}>
//                 <td>{h.name}</td>
//                 <td>{h.ownerEmail}</td>
//                 <td>{h.status}</td>
//                 <td>{new Date(h.createdAt).toLocaleString()}</td>
//                 <td>
//                   {h.status === 'active'
//                     ? <button onClick={()=>toggleStatus(h._id, 'suspended')}>Suspend</button>
//                     : <button onClick={()=>toggleStatus(h._id, 'active')}>Activate</button>}
//                 </td>
//               </tr>
//             ))}
//             {list.length === 0 && <tr><td colSpan="5">No hospitals yet</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import AdminNav from '../../components/AdminNav';
import http from '../../api/http';

export default function Hospitals() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: '',
    ownerFirstName: '',
    ownerLastName: '',
    ownerPhone: '',
    ownerEmail: '',
    tempPassword: '',
    paymentRequiredBeforeConsult: true,
    city: '',
    state: 'Telangana',
    pincode: '',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await http.get('/admin/hospitals');
      setList(data || []);
    } catch (e) {
      setList([]);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    try {
      await http.post('/admin/hospitals', {
        name: form.name,
        owner: {
          firstName: form.ownerFirstName,
          lastName: form.ownerLastName,
          phone: form.ownerPhone,
          email: form.ownerEmail,
        },
        address: { city: form.city, state: form.state, pincode: form.pincode },
        paymentRequiredBeforeConsult: form.paymentRequiredBeforeConsult,
        tempPassword: form.tempPassword || 'Owner@12345',
      });
      setMsg('✅ Hospital created successfully!');
      setForm({
        name: '', ownerFirstName:'', ownerLastName:'', ownerPhone:'', ownerEmail:'',
        tempPassword:'', paymentRequiredBeforeConsult:true, city:'', state:'Telangana', pincode:''
      });
      load();
    } catch (e) {
      setMsg('❌ ' + (e.response?.data?.message || 'Failed to create hospital'));
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      await http.patch(`/admin/hospitals/${id}/status`, { status });
      load();
    } catch {}
  };

  return (
    <>
      <style>{`
        .hospitals-page {
          min-height: 100vh;
          background: var(--color-gray-50);
        }
        
        .hospitals-container {
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
          display: flex;
          align-items: center;
          gap: 8px;
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
        
        .form-input {
          padding: 12px 16px;
          border: 2px solid var(--color-gray-100);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
          background: var(--color-gray-50);
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(13,71,161,0.08);
        }
        
        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: var(--color-gray-50);
          border-radius: 8px;
        }
        
        .checkbox-input {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        
        .checkbox-label {
          font-weight: 500;
          color: var(--color-gray-600);
          cursor: pointer;
        }
        
        .submit-btn {
          padding: 14px 32px;
          background: linear-gradient(135deg, #0D47A1 0%, #1565C0 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 15px;
          margin-top: 8px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(13,71,161,0.3);
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .message {
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
          font-weight: 500;
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
          color: var(--color-gray-700);
        }
        
        .hospitals-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .hospitals-table th {
          background: var(--color-gray-50);
          padding: 16px 24px;
          text-align: left;
          font-weight: 600;
          color: var(--color-gray-700);
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .hospitals-table td {
          padding: 20px 24px;
          border-top: 1px solid var(--color-gray-100);
          font-size: 14px;
        }
        
        .hospitals-table tbody tr {
          transition: all 0.2s;
        }
        
        .hospitals-table tbody tr:hover {
          background: var(--color-gray-50);
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
          background: #FFEBEE;
          color: #C62828;
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
          background: var(--color-danger);
          color: white;
        }
        
        .action-btn.suspend {
        background: #e53935; /* red */
        color: white;
        }
        .action-btn.activate {
          background: #43a047; /* green */
          color: white;
        }
        
        .empty-state {
          padding: 80px 20px;
          text-align: center;
          color: var(--color-gray-400);
        }
        
        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }
      `}</style>
      
      <div className="hospitals-page">
        <AdminNav />
        
        <div className="hospitals-container">
          <div className="page-header">
            <h1 className="page-title">Hospital Management</h1>
            <p className="page-subtitle">Create and manage hospital accounts with owner credentials</p>
          </div>
          
          <div className="form-card">
            <h3 className="form-section-title">
              <span>➕</span> Create New Hospital
            </h3>
            
            <form onSubmit={create}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Hospital Name *</label>
                  <input 
                    className="form-input" 
                    placeholder="Enter hospital name" 
                    value={form.name} 
                    onChange={e=>setForm({...form, name:e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Owner First Name *</label>
                  <input 
                    className="form-input" 
                    placeholder="First name" 
                    value={form.ownerFirstName} 
                    onChange={e=>setForm({...form, ownerFirstName:e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Owner Last Name *</label>
                  <input 
                    className="form-input" 
                    placeholder="Last name" 
                    value={form.ownerLastName} 
                    onChange={e=>setForm({...form, ownerLastName:e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Owner Phone *</label>
                  <input 
                    className="form-input" 
                    placeholder="Phone number" 
                    value={form.ownerPhone} 
                    onChange={e=>setForm({...form, ownerPhone:e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Owner Email *</label>
                  <input 
                    type="email"
                    className="form-input" 
                    placeholder="Email address" 
                    value={form.ownerEmail} 
                    onChange={e=>setForm({...form, ownerEmail:e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input 
                    type="text"
                    className="form-input" 
                    placeholder="Default: Owner@12345" 
                    value={form.tempPassword} 
                    onChange={e=>setForm({...form, tempPassword:e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input 
                    className="form-input" 
                    placeholder="City" 
                    value={form.city} 
                    onChange={e=>setForm({...form, city:e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <input 
                    className="form-input" 
                    placeholder="State" 
                    value={form.state} 
                    onChange={e=>setForm({...form, state:e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input 
                    className="form-input" 
                    placeholder="Pincode" 
                    value={form.pincode} 
                    onChange={e=>setForm({...form, pincode:e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="checkbox-group" style={{marginTop: 20}}>
                <input 
                  type="checkbox" 
                  id="payment-required"
                  className="checkbox-input"
                  checked={form.paymentRequiredBeforeConsult}
                  onChange={e=>setForm({...form, paymentRequiredBeforeConsult:e.target.checked})}
                />
                <label htmlFor="payment-required" className="checkbox-label">
                  💳 Require payment before consultation
                </label>
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Creating...' : '✓ Create Hospital'}
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
              <h3 className="table-title">All Hospitals</h3>
            </div>
            
            <table className="hospitals-table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Owner Email</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(h => (
                  <tr key={h._id}>
                    <td style={{fontWeight: 600}}>{h.name}</td>
                    <td>{h.ownerEmail}</td>
                    <td>
                      <span className={`status-badge ${h.status}`}>
                        {h.status === 'active' ? '✓ Active' : '⏸ Suspended'}
                      </span>
                    </td>
                    <td>{new Date(h.createdAt).toLocaleDateString()}</td>
                    <td>
                      {h.status === 'active' ? (
                        <button 
                          onClick={()=>toggleStatus(h._id, 'suspended')} 
                          className="action-btn suspend"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button 
                          onClick={()=>toggleStatus(h._id, 'active')} 
                          className="action-btn activate"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <div className="empty-icon">🏥</div>
                        <div>No hospitals registered yet</div>
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

