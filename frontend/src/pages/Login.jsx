// import { useState } from 'react';
// import http from '../api/http';

// export default function Login() {
//   const [email, setEmail] = useState('admin@ayusahayak.in');
//   const [password, setPassword] = useState('Admin@12345');
//   const [error, setError] = useState('');

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       const { data } = await http.post('/auth/login', { email, password });
//       localStorage.setItem('accessToken', data.accessToken);
//       localStorage.setItem('user', JSON.stringify(data.user));
//       const role = data.user.role;
//       if (role === 'admin') window.location.href = '/admin';
//       else if (role === 'hospital_owner') window.location.href = '/owner';
//       else if (role === 'nurse') window.location.href = '/nurse';
//       else if (role === 'doctor') window.location.href = '/doctor';
//     } catch (e) {
//       setError(e.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <div style={{ maxWidth: 360, margin: '80px auto' }}>
//       <h2>AyuSahayak Login</h2>
//       <form onSubmit={onSubmit}>
//         <div>
//           <label>Email</label>
//           <input value={email} onChange={(e)=>setEmail(e.target.value)} />
//         </div>
//         <div>
//           <label>Password</label>
//           <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
//         </div>
//         <button type="submit">Login</button>
//         {error && <p style={{ color:'red' }}>{error}</p>}
//       </form>
//     </div>
//   );
// }
import { useState } from 'react';
import http from '../api/http';

export default function Login() {
  const [email, setEmail] = useState('admin@ayusahayak.in');
  const [password, setPassword] = useState('Admin@12345');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await http.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      const role = data.user.role;
      if (role === 'admin') window.location.href = '/admin';
      else if (role === 'hospital_owner') window.location.href = '/owner';
      else if (role === 'nurse') window.location.href = '/nurse';
      else if (role === 'doctor') window.location.href = '/doctor';
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #00897B 100%);
          position: relative;
          overflow: hidden;
        }
        
        .login-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 800px;
          height: 800px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
        }
        
        .login-container::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: rgba(255,255,255,0.03);
          border-radius: 50%;
        }
        
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          color: white;
          position: relative;
          z-index: 1;
        }
        
        .login-logo {
          font-size: 48px;
          font-weight: 700;
          margin-bottom: 24px;
          font-family: 'Merriweather', serif;
        }
        
        .login-tagline {
          font-size: 20px;
          opacity: 0.95;
          line-height: 1.6;
          max-width: 500px;
        }
        
        .login-features {
          margin-top: 48px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.15);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          position: relative;
          z-index: 1;
        }
        
        .login-card {
          background: white;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.2);
          width: 100%;
          max-width: 460px;
          animation: fadeInUp 0.6s ease-out;
        }
        
        .login-title {
          font-size: 32px;
          font-weight: 700;
          color: var(--color-gray-700);
          margin-bottom: 12px;
        }
        
        .login-subtitle {
          color: var(--color-gray-400);
          margin-bottom: 32px;
        }
        
        .form-group {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: var(--color-gray-600);
          font-size: 14px;
        }
        
        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid var(--color-gray-100);
          border-radius: 12px;
          font-size: 15px;
          transition: all 0.2s;
          background: var(--color-gray-50);
        }
        
        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(13,71,161,0.08);
        }
        
        .submit-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #0D47A1 0%, #1565C0 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 8px;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(13,71,161,0.3);
        }
        
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .error-msg {
          background: #FFEBEE;
          color: #C62828;
          padding: 12px 16px;
          border-radius: 8px;
          margin-top: 16px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        
        @media (max-width: 968px) {
          .login-container {
            flex-direction: column;
          }
          .login-left {
            padding: 40px 24px;
          }
          .login-features {
            flex-direction: row;
            flex-wrap: wrap;
          }
          .login-right {
            padding: 24px;
          }
          .login-card {
            padding: 32px 24px;
          }
        }
      `}</style>
      
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo">🏥 AyuSahayak</div>
          <div className="login-tagline">
            Advanced Healthcare Platform for Seamless Patient Care & Hospital Management
          </div>
          <div className="login-features">
            <div className="feature-item">
              <div className="feature-icon">👨‍⚕️</div>
              <div>
                <div style={{fontWeight:600}}>Expert Doctors</div>
                <div style={{opacity:0.8,fontSize:14}}>24/7 consultation available</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <div>
                <div style={{fontWeight:600}}>Digital Records</div>
                <div style={{opacity:0.8,fontSize:14}}>Secure patient management</div>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🎥</div>
              <div>
                <div style={{fontWeight:600}}>Video Consultation</div>
                <div style={{opacity:0.8,fontSize:14}}>Connect from anywhere</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to access your dashboard</p>
            
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span> Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
              
              {error && (
                <div className="error-msg">
                  <span>⚠️</span> {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
