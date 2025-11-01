// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import NurseNav from '../../components/NurseNav';
// import http from '../../api/http';

// export default function EditPatient() {
//   const navigate = useNavigate();
//   const params = new URLSearchParams(useLocation().search);
//   const ref = params.get('ref') || '';
//   const [p, setP] = useState(null);
//   const [msg, setMsg] = useState('');

//   useEffect(() => {
//     (async () => {
//       try {
//         if (!ref) { setMsg('Missing patient ref'); return; }
//         const { data } = await http.get(`/patients/${encodeURIComponent(ref)}`);
//         setP({
//           id: data.id,
//           patientId: data.patientId,
//           firstName: data.personalInfo.firstName,
//           lastName: data.personalInfo.lastName,
//           age: data.personalInfo.age ?? '',
//           gender: data.personalInfo.gender || '',
//           height: data.personalInfo.height ?? '',
//           weight: data.personalInfo.weight ?? '',
//           phone: data.personalInfo.phone || ''
//         });
//       } catch (e) {
//         setMsg(e.response?.data?.message || 'Load failed');
//       }
//     })();
//   }, [ref]);

//   const save = async (e) => {
//     e.preventDefault();
//     setMsg('');
//     try {
//       await http.put(`/patients/${p.id}`, {
//         personalInfo: {
//           firstName: p.firstName,
//           lastName: p.lastName,
//           age: p.age === '' ? null : Number(p.age),
//           gender: p.gender,
//           height: p.height === '' ? null : Number(p.height),
//           weight: p.weight === '' ? null : Number(p.weight),
//           phone: p.phone
//         }
//       });
//       navigate('/nurse/patients'); 
//     } catch (e) {
//       setMsg(e.response?.data?.message || 'Update failed');
//     }
//   };

//   if (!p) return (
//     <div>
//       <NurseNav />
//       <div style={{ padding: 16 }}>
//         <button onClick={()=>navigate(-1)}>&larr; Back</button>
//         <h3 style={{ marginTop: 12 }}>Edit Patient</h3>
//         {msg ? <p>{msg}</p> : <p>Loading...</p>}
//       </div>
//     </div>
//   );

//   return (
//     <div>
//       <NurseNav />
//       <div style={{ padding: 16, maxWidth: 720, margin: '0 auto' }}>
//         <button onClick={()=>navigate(-1)}>&larr; Back</button>
//         <h3 style={{ marginTop: 12 }}>Edit Patient — {p.patientId}</h3>
//         {msg && <p>{msg}</p>}
//         <form onSubmit={save} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//           <input placeholder="First name" value={p.firstName} onChange={e=>setP({ ...p, firstName: e.target.value })} />
//           <input placeholder="Last name" value={p.lastName} onChange={e=>setP({ ...p, lastName: e.target.value })} />
//           <input placeholder="Age" type="number" value={p.age} onChange={e=>setP({ ...p, age: e.target.value })} />
//           <select value={p.gender} onChange={e=>setP({ ...p, gender: e.target.value })}>
//             <option value="">Select gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//           <input placeholder="Height (cm)" type="number" value={p.height} onChange={e=>setP({ ...p, height: e.target.value })} />
//           <input placeholder="Weight (kg)" type="number" value={p.weight} onChange={e=>setP({ ...p, weight: e.target.value })} />
//           <input placeholder="Phone" value={p.phone} onChange={e=>setP({ ...p, phone: e.target.value })} />
//           <div style={{ gridColumn: '1 / span 2' }}>
//             <button type="submit">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NurseNav from '../../components/NurseNav';
import http from '../../api/http';

export default function EditPatient() {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const ref = params.get('ref') || '';
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        if (!ref) { setMsg('Missing patient ref'); return; }
        const { data } = await http.get(`/patients/${encodeURIComponent(ref)}`);
        setP({
          id: data.id,
          patientId: data.patientId,
          firstName: data.personalInfo.firstName,
          lastName: data.personalInfo.lastName,
          age: data.personalInfo.age ?? '',
          gender: data.personalInfo.gender || '',
          height: data.personalInfo.height ?? '',
          weight: data.personalInfo.weight ?? '',
          phone: data.personalInfo.phone || ''
        });
      } catch (e) {
        setMsg(e.response?.data?.message || 'Load failed');
      }
    })();
  }, [ref]);

  const save = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await http.put(`/patients/${p.id}`, {
        personalInfo: {
          firstName: p.firstName,
          lastName: p.lastName,
          age: p.age === '' ? null : Number(p.age),
          gender: p.gender,
          height: p.height === '' ? null : Number(p.height),
          weight: p.weight === '' ? null : Number(p.weight),
          phone: p.phone
        }
      });
      navigate('/nurse/patients'); 
    } catch (e) {
      setMsg(e.response?.data?.message || 'Update failed');
    }
  };

  if (!p) return (
    <div>
      <NurseNav />
      <div style={{ padding: 16 }}>
        <button onClick={()=>navigate(-1)}>&larr; Back</button>
        <h3 style={{ marginTop: 12 }}>Edit Patient</h3>
        {msg ? <p>{msg}</p> : <p>Loading...</p>}
      </div>
    </div>
  );

  return (
    <div className="edit-patient-page">
      <style>{`
        .edit-patient-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .edit-container {
          padding: 24px;
          max-width: 900px;
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
          color: hsl(215 16% 47%);
        }
        .breadcrumb a {
          color: hsl(174 62% 47%);
          text-decoration: none;
          transition: color 0.2s;
        }
        .breadcrumb a:hover {
          color: hsl(174 72% 42%);
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
        }
        .patient-id {
          font-family: monospace;
          font-size: 14px;
          color: hsl(215 16% 47%);
          background: hsl(210 40% 98%);
          padding: 8px 16px;
          border-radius: 8px;
        }
        
        .edit-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 32px;
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
        
        .alert {
          padding: 14px 18px;
          border-radius: 10px;
          margin-bottom: 24px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .alert-error {
          background: hsl(4 90% 96%);
          color: hsl(4 90% 50%);
          border: 1px solid hsl(4 90% 86%);
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          padding-top: 24px;
          border-top: 1px solid hsl(214 32% 91%);
        }
        .btn {
          padding: 14px 32px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary {
          background: linear-gradient(135deg, hsl(174 62% 47%) 0%, hsl(174 72% 42%) 100%);
          color: white;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px hsla(174 62% 47% / 0.3);
        }
        .btn-secondary {
          background: white;
          border: 1px solid hsl(214 32% 91%);
          color: hsl(215 25% 27%);
        }
        .btn-secondary:hover {
          background: hsl(210 40% 98%);
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
        }
      `}</style>
      
      <NurseNav />
      <div className="edit-container">
        <div className="breadcrumb">
          <a href="/nurse/home">Home</a>
          <span>/</span>
          <a href="/nurse/patients">Patients</a>
          <span>/</span>
          <span>Edit</span>
        </div>
        
        <div className="page-header">
          <h1>✏️ Edit Patient</h1>
          <div className="patient-id">{p.patientId}</div>
        </div>

        <div className="edit-card">
          {msg && (
            <div className="alert alert-error">
              <span>⚠</span>
              {msg}
            </div>
          )}
          
          <form onSubmit={save}>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name *</label>
                <input 
                  placeholder="First name" 
                  value={p.firstName} 
                  onChange={e=>setP({...p, firstName:e.target.value})} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input 
                  placeholder="Last name" 
                  value={p.lastName} 
                  onChange={e=>setP({...p, lastName:e.target.value})} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input 
                  placeholder="Age" 
                  type="number"
                  value={p.age} 
                  onChange={e=>setP({...p, age:e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select value={p.gender} onChange={e=>setP({...p, gender:e.target.value})}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input 
                  placeholder="Height in cm" 
                  type="number"
                  value={p.height} 
                  onChange={e=>setP({...p, height:e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input 
                  placeholder="Weight in kg" 
                  type="number"
                  value={p.weight} 
                  onChange={e=>setP({...p, weight:e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input 
                  placeholder="+91 XXXXXXXXXX" 
                  value={p.phone} 
                  onChange={e=>setP({...p, phone:e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <span>✓</span> Save Changes
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={()=>navigate('/nurse/patients')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

