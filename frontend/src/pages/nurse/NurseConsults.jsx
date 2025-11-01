// import { useEffect, useState } from 'react';
// import NurseNav from '../../components/NurseNav';
// import http from '../../api/http';
// const toast = (msg) => {
//   // lightweight toast without a library
//   const d = document.createElement('div');
//   d.textContent = msg;
//   d.style.position = 'fixed';
//   d.style.bottom = '20px';
//   d.style.right = '20px';
//   d.style.padding = '10px 14px';
//   d.style.background = '#333';
//   d.style.color = '#fff';
//   d.style.borderRadius = '6px';
//   d.style.zIndex = 9999;
//   document.body.appendChild(d);
//   setTimeout(()=>d.remove(), 2000);
// };

// export default function NurseConsults() {
//   const [consults, setConsults] = useState([]);
//   const [form, setForm] = useState({ patientRef:'', chiefComplaint:'', conditionType:'other', priority:'normal' });
//   const [msg, setMsg] = useState('');
//   const [pay, setPay] = useState({ consultationId:'', amount:'200' });
//   const [orderInfo, setOrderInfo] = useState(null);
//   const [prRef, setPrRef] = useState('');

//   const load = async () => {
//     try {
//        const token = localStorage.getItem('accessToken');
//     if (!token) {
//       toast('Session expired. Please log in again.');
//       window.location.href = '/login';
//       return;
//     }
//       const { data } = await http.get('/nurse/consultations');
//       setConsults(data);
//     } catch {
//       setConsults([]);
//     }
//   };

//   useEffect(()=>{ load(); }, []);
//   useEffect(() => {
//   if (!window.Razorpay) {
//     const s = document.createElement('script');
//     s.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     s.async = true;
//     document.body.appendChild(s);
//   }
// }, []);


//   const createConsult = async (e) => {
//     e.preventDefault();
//     setMsg('');
//     try {
//       const { data } = await http.post('/nurse/consultations', form);
//       setMsg(data.paymentRequired ? 'Queued. Payment required before doctor sees it.' : 'Queued.');
//       setForm({ patientRef:'', chiefComplaint:'', conditionType:'other', priority:'normal' });
//       load();
//     } catch (e) {
//       setMsg(e.response?.data?.message || 'Failed');
//     }
//   };
// const createOrder = async () => {
//   const cid = (pay.consultationId || '').trim(); // remove hidden tabs/newlines/spaces
//   if (!cid || !pay.amount) {
//     alert('Enter consultationId and amount');
//     return;
//   }
//   try {
//     const { data } = await http.post('/payments/orders', {
//       consultationRef: cid,                 // send as consultationRef (can be _id or CONxxxxx)
//       amountInRupees: pay.amount
//     });
//     setOrderInfo(data);
//     alert(`Order created: ${data.orderId}. For demo, click Mark Paid (dev).`);
//   } catch (e) {
//     alert(e.response?.data?.message || 'Order failed');
//   }
// };

// const markPaidDev = async () => {
//   const cid = (pay.consultationId || '').trim();
//   if (!cid) {
//     alert('Enter consultationId');
//     return;
//   }
//   try {
//     await http.post('/payments/dev/mark-paid', { consultationRef: cid });
//     alert('Marked paid (dev). Doctor queue will unlock this case.');
//     setOrderInfo(null);
//     load();
//   } catch (e) {
//     alert(e.response?.data?.message || 'Mark paid failed');
//   }
// };
// const payForConsult = async (consultation) => {
//   try {

//      const token = localStorage.getItem('accessToken');
//     if (!token) {
//       toast('Session expired. Please log in again.');
//       window.location.href = '/login';
//       return;
//     }

//     if (!window.Razorpay) { alert('Razorpay not loaded yet'); return; }
//     const amountInRupees = Number(pay.amount || 200); // or from your UI/default per hospital

//     // Create order
//     const { data } = await http.post('/payments/orders', {
//       consultationRef: consultation.consultationId || consultation.id,
//       amountInRupees
//     });
//     console.log('rzp key:', process.env.REACT_APP_RAZORPAY_KEY_ID ? 'present' : 'missing');

//     const options = {
//       key: process.env.REACT_APP_RAZORPAY_KEY_ID, // set in .env
//       amount: data.amount,
//       currency: 'INR',
//       name: 'Teleconsultation Payment',
//       order_id: data.orderId,
//       handler: async function (response) {
//   try {
//     await http.post('/payments/verify', {
//       razorpay_order_id: response.razorpay_order_id,
//       razorpay_payment_id: response.razorpay_payment_id,
//       razorpay_signature: response.razorpay_signature
//     });
//     toast('Payment successful');
//     // Optimistic update: flip payReady for this row immediately
//     setConsults(prev => prev.map(x =>
//       (x.consultationId === (consultation.consultationId || consultation.id) || x.id === consultation.id)
//         ? { ...x, payReady: true }
//         : x
//     ));
//     // Then hard refresh after a short delay in case DB write is async
//     // setTimeout(load, 2000);
//   } catch (e) {
//     alert(e.response?.data?.message || 'Verification failed');
//   }
// },

//       theme: { color: '#528FF0' }
//     };
//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (e) {
//     alert(e.response?.data?.message || 'Failed to create order');
//   }
// };

// const viewPrescription = async () => {
//   try {
//     const { data } = await http.get(`/prescriptions/by-consultation/${encodeURIComponent(prRef.trim())}`);
//     alert(`Prescription: ${data.medications?.map(m=>m.name).join(', ') || 'No meds'}`);
//   } catch (e) {
//     alert(e.response?.data?.message || 'Not found');
//   }
// };

// const startVideo = async (c) => {
//   try {
//     await http.post(`/nurse/consultations/${c.id}/video/start`);
//     window.location.href = `/video?ref=${encodeURIComponent(c.consultationId || c.id)}`;
//   } catch (e) {
//     alert(e.response?.data?.message || 'Failed to start video');
//   }
// };

//   return (
//     <div>
//       <NurseNav />
//       <div style={{ padding:16 }}>
//         <h3>Consultations</h3>

//         <form onSubmit={createConsult} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, maxWidth:900 }}>
//           <input placeholder="Patient _id or PAT000001" value={form.patientRef} onChange={e=>setForm({...form, patientRef:e.target.value})}/>
//           <input placeholder="Chief complaint" value={form.chiefComplaint} onChange={e=>setForm({...form, chiefComplaint:e.target.value})}/>
//           <select value={form.conditionType} onChange={e=>setForm({...form, conditionType:e.target.value})}>
//             <option value="skin">Skin</option>
//             <option value="wound">Wound</option>
//             <option value="other">Other</option>
//           </select>
//           <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
//             <option value="normal">Normal</option>
//             <option value="urgent">Urgent</option>
//           </select>
//           <button type="submit" style={{ gridColumn:'1 / span 2' }}>Create Consultation</button>
//           {msg && <p>{msg}</p>}
//         </form>

//         <hr />

//         <table border="1" cellPadding="6">
//           <thead>
//             <tr>
//               <th>Consultation</th>
//               <th>Status</th>
//               <th>Priority</th>
//               <th>Created</th>
//               <th>Prescription</th>
//               <th>Payment Status</th>
//               <th colSpan="2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//   {consults.map(c=>(
//     <tr key={c.id}>
//       <td>{c.consultationId || c.id}</td>
//       <td>{c.status}</td>
//       <td>{c.priority}</td>
//       <td>{new Date(c.createdAt).toLocaleString()}</td>
//       <td>
//         {/* <button
//           type="button"
//           onClick={()=>window.location.href=`/nurse/prescription?ref=${encodeURIComponent(c.consultationId || c.id)}`}
//           disabled={c.status !== 'completed'}
//           title={c.status !== 'completed' ? 'Prescription visible after completion' : ''}
//         >
//           View Prescription
//         </button> */}
//         <a
//   href={`/nurse/prescription?ref=${encodeURIComponent(c.consultationId || c.id)}`}
//   onClick={e => {
//     if (c.status !== 'completed') {
//       e.preventDefault();
//       alert('Prescription visible after completion');
//     }
//   }}
// >
//   View
// </a> </td>
//     <td>{c.payReady ? 'completed' : 'pending'}</td>
//     <td>
//   {c.payReady
//     ? <span style={{ color:'#2e7d32' }}>Paid</span>
//     : <a href="#pay" onClick={(e)=>{ e.preventDefault(); payForConsult(c); }}>Pay</a>
//   }
// </td>
//       <td><a href="#video" onClick={(e)=>{ e.preventDefault(); startVideo(c); }}>Start Video</a>
//       </td>


//     </tr>
//   ))}
//   {consults.length===0 && <tr><td colSpan="7">No consultations</td></tr>}
// </tbody>

//         </table>

//         {/* <div style={{ marginTop:16, padding:12, border:'1px solid #eee', maxWidth:900 }}>
//           <h4>Payment (Dev Demo)</h4>
//           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
//             <input
//               placeholder="Consultation _id"
//               value={pay.consultationId}
//               onChange={e=>setPay({...pay, consultationId:e.target.value})}
//             />
//             <input
//               placeholder="Amount (INR)"
//               value={pay.amount}
//               onChange={e=>setPay({...pay, amount:e.target.value})}
//             />
//             <div>
//               <button type="button" onClick={createOrder}>Create Order</button>
//               <button type="button" onClick={markPaidDev} style={{ marginLeft:8 }}>Mark Paid (dev)</button>
//             </div>
//           </div>
//           {orderInfo && (
//             <p style={{ marginTop:8 }}>
//               Order: {orderInfo.orderId} | Amount: ₹{(orderInfo.amount/100).toFixed(2)} | Currency: {orderInfo.currency}
//             </p>
//           )}
//           <p style={{ color:'#666', marginTop:8 }}>
//             Note: For production, integrate Razorpay Checkout and call /api/payments/verify with real order_id, payment_id, and signature.
//           </p>
//         </div> */}
//         {/* <div style={{ marginTop: 16 }}>
//   <input placeholder="Consultation _id" value={pay.consultationId} onChange={e=>setPay({...pay, consultationId:e.target.value})}/>
//   <input placeholder="Amount (INR)" value={pay.amount} onChange={e=>setPay({...pay, amount:e.target.value})}/>
//   <button type="button" onClick={createOrder}>Create Order</button>
//   <button type="button" onClick={async ()=>{
//     try {
//       await http.post('/payments/dev/mark-paid', { consultationId: pay.consultationId });
//       alert('Marked paid (dev). Queue will unlock.');
//       load();
//     } catch (e) { alert('Failed'); }
//   }} style={{ marginLeft:8 }}>Mark Paid (dev)</button>
// </div> */}

//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from 'react';
import NurseNav from '../../components/NurseNav';
import http from '../../api/http';

const toast = (msg) => {
  const d = document.createElement('div');
  d.textContent = msg;
  d.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 20px;
    background: hsl(215 25% 27%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    z-index: 9999;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(), 3000);
};

export default function NurseConsults() {
  const [consults, setConsults] = useState([]);
  const [form, setForm] = useState({ patientRef:'', chiefComplaint:'', conditionType:'other', priority:'normal' });
  const [msg, setMsg] = useState('');
  const [pay, setPay] = useState({ consultationId:'', amount:'200' });
  const [orderInfo, setOrderInfo] = useState(null);
  const [prRef, setPrRef] = useState('');

  const load = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }
      const { data } = await http.get('/nurse/consultations');
      setConsults(data);
    } catch {
      setConsults([]);
    }
  };

  useEffect(()=>{ load(); }, []);
  useEffect(() => {
    if (!window.Razorpay) {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const createConsult = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await http.post('/nurse/consultations', form);
      setMsg(data.paymentRequired ? 'Consultation created. Payment required ⚠' : 'Consultation created successfully ✓');
      setForm({ patientRef:'', chiefComplaint:'', conditionType:'other', priority:'normal' });
      load();
    } catch (e) {
      setMsg(e.response?.data?.message || 'Failed');
    }
  };

  const createOrder = async () => {
    const cid = (pay.consultationId || '').trim();
    if (!cid || !pay.amount) {
      alert('Enter consultationId and amount');
      return;
    }
    try {
      const { data } = await http.post('/payments/orders', {
        consultationRef: cid,
        amountInRupees: pay.amount
      });
      setOrderInfo(data);
      toast('Payment order created');
    } catch (e) {
      alert(e.response?.data?.message || 'Order creation failed');
    }
  };

  const openRazorpay = () => {
    if (!orderInfo) return;
    const options = {
      key: orderInfo.razorpay_key_id,
      amount: orderInfo.amount,
      currency: orderInfo.currency,
      name: 'AyuSahayak',
      description: `Consultation Payment`,
      order_id: orderInfo.orderId,
      handler: async (response) => {
        try {
          await http.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          toast('Payment successful ✓');
          setOrderInfo(null);
          setPay({ consultationId:'', amount:'200' });
          load();
        } catch (e) {
          alert('Payment verification failed');
        }
      },
      prefill: { name: '', email: '', contact: '' },
      theme: { color: '#00897B' }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const viewPrescription = (consultationIdOrRef) => {
    setPrRef(consultationIdOrRef);
    window.location.href = `/nurse/prescription?ref=${encodeURIComponent(consultationIdOrRef)}`;
  };

  const enableVideo = async (id) => {
    try {
      await http.patch(`/nurse/consultations/${id}/enable-video`);
      toast('Video enabled ✓');
      load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="consults-page">
      <style>{`
        .consults-page {
          min-height: 100vh;
          background: hsl(210 20% 98%);
        }
        .consults-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          animation: fadeInUp 0.5s ease-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .page-header {
          margin-bottom: 32px;
        }
        .page-header h1 {
          font-size: 32px;
          font-weight: 700;
          color: hsl(215 25% 27%);
          margin: 0 0 8px 0;
        }
        .page-header p {
          color: hsl(215 16% 47%);
          font-size: 16px;
          margin: 0;
        }
        
        .consults-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
        }
        
        .card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .card h2 {
          font-size: 20px;
          font-weight: 600;
          color: hsl(215 25% 27%);
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: hsl(215 25% 27%);
          margin-bottom: 8px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid hsl(214 32% 91%);
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: hsl(174 62% 47%);
          box-shadow: 0 0 0 3px hsla(174 62% 47% / 0.1);
        }
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 15px;
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
          background: hsl(212 90% 48%);
          color: white;
        }
        .btn-secondary:hover {
          background: hsl(212 90% 42%);
        }
        .btn-outline {
          background: white;
          border: 1px solid hsl(214 32% 91%);
          color: hsl(215 25% 27%);
        }
        .btn-outline:hover {
          background: hsl(210 40% 98%);
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
        .alert-warning {
          background: hsl(38 92% 96%);
          color: hsl(38 92% 40%);
          border: 1px solid hsl(38 92% 86%);
        }
        .alert-error {
          background: hsl(4 90% 96%);
          color: hsl(4 90% 50%);
          border: 1px solid hsl(4 90% 86%);
        }
        
        .table-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .consults-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .consults-table thead th {
          background: hsl(210 40% 98%);
          padding: 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
          color: hsl(215 25% 27%);
          border-bottom: 2px solid hsl(214 32% 91%);
        }
        .consults-table tbody td {
          padding: 18px 16px;
          border-bottom: 1px solid hsl(214 32% 91%);
          font-size: 15px;
        }
        .consults-table tbody tr:hover {
          background: hsl(210 40% 98%);
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          gap: 4px;
        }
        .badge-queue {
          background: hsl(212 90% 95%);
          color: hsl(212 90% 45%);
        }
        .badge-progress {
          background: hsl(38 92% 95%);
          color: hsl(38 92% 45%);
        }
        .badge-completed {
          background: hsl(142 76% 95%);
          color: hsl(142 76% 36%);
        }
        .badge-paid {
          background: hsl(142 76% 95%);
          color: hsl(142 76% 36%);
        }
        .badge-pending {
          background: hsl(38 92% 95%);
          color: hsl(38 92% 45%);
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .btn-sm {
          padding: 6px 12px;
          font-size: 13px;
          border-radius: 6px;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: hsl(215 16% 47%);
        }
        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        @media (max-width: 1024px) {
          .consults-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .consults-table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
      
      <NurseNav />
      <div className="consults-container">
        <div className="page-header">
          <h1>🩺 Consultations</h1>
          <p>Manage patient consultations and payments</p>
        </div>

        <div className="consults-grid">
          <div className="card">
            <h2>📝 Create Consultation</h2>
            {msg && (
              <div className={`alert ${msg.includes('✓') || msg.includes('success') ? 'alert-success' : msg.includes('⚠') ? 'alert-warning' : 'alert-error'}`}>
                {msg}
              </div>
            )}
            <form onSubmit={createConsult}>
              <div className="form-group">
                <label>Patient ID / Reference *</label>
                <input 
                  placeholder="PAT000001 or MongoDB _id" 
                  value={form.patientRef} 
                  onChange={e=>setForm({...form, patientRef:e.target.value})} 
                  required
                />
              </div>
              <div className="form-group">
                <label>Chief Complaint</label>
                <textarea 
                  placeholder="Describe patient's main concern..." 
                  value={form.chiefComplaint} 
                  onChange={e=>setForm({...form, chiefComplaint:e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Condition Type</label>
                <select value={form.conditionType} onChange={e=>setForm({...form, conditionType:e.target.value})}>
                  <option value="other">Other</option>
                  <option value="skin">Skin</option>
                  <option value="wound">Wound</option>
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select value={form.priority} onChange={e=>setForm({...form, priority:e.target.value})}>
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                <span>✓</span> Create Consultation
              </button>
            </form>
          </div>

          <div className="card">
            <h2>💳 Process Payment</h2>
            <div className="form-group">
              <label>Consultation ID *</label>
              <input 
                placeholder="CON000001 or MongoDB _id" 
                value={pay.consultationId} 
                onChange={e=>setPay({...pay, consultationId:e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input 
                placeholder="200" 
                value={pay.amount} 
                onChange={e=>setPay({...pay, amount:e.target.value})}
              />
            </div>
            <div style={{display:'flex', gap:12}}>
              <button onClick={createOrder} className="btn btn-secondary">
                Create Order
              </button>
              {orderInfo && (
                <button onClick={openRazorpay} className="btn btn-primary">
                  💳 Pay Now
                </button>
              )}
            </div>
            {orderInfo && (
              <div style={{marginTop:16, padding:12, background:'hsl(210 40% 98%)', borderRadius:8, fontSize:14}}>
                <div><strong>Order ID:</strong> {orderInfo.orderId}</div>
                <div><strong>Amount:</strong> ₹{orderInfo.amount / 100}</div>
              </div>
            )}
          </div>
        </div>

        <div className="table-card">
          <h2>📊 All Consultations ({consults.length})</h2>
          {consults.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🩺</div>
              <h3>No consultations yet</h3>
              <p>Create your first consultation above</p>
            </div>
          ) : (
            <table className="consults-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Complaint</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consults.map(c=>(
                  <tr key={c.id}>
                    <td style={{fontFamily:'monospace', fontSize:13}}>{c.consultationId}</td>
                    <td>{c.patient?.name || '—'}</td>
                    <td style={{maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                      {c.chiefComplaint || '—'}
                    </td>
                    <td>
                      <span className={`badge badge-${c.status === 'completed' ? 'completed' : c.status === 'in_progress' ? 'progress' : 'queue'}`}>
                        {c.status === 'in_queue' && '⏳'}
                        {c.status === 'in_progress' && '🔄'}
                        {c.status === 'completed' && '✓'}
                        {' '}{c.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${c.paymentStatus === 'paid' ? 'paid' : 'pending'}`}>
                        {c.paymentStatus === 'paid' ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{fontSize:13, color:'hsl(215 16% 47%)'}}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {c.status === 'completed' && (
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={()=>viewPrescription(c.consultationId)}
                          >
                            📄 Rx
                          </button>
                        )}
                        {(c.status === 'in_progress' || c.status === 'completed') && (
                          <button 
                            className="btn btn-outline btn-sm" 
                            onClick={()=>window.location.href=`/video?ref=${encodeURIComponent(c.consultationId)}`}
                          >
                            📹 Video
                          </button>
                        )}
                        {c.status === 'in_progress' && !c.video?.enabled && (
                          <button 
                            className="btn btn-secondary btn-sm" 
                            onClick={()=>enableVideo(c.id)}
                          >
                            Enable Video
                          </button>
                        )}
                      </div>
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

