import React, { useEffect, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Tambahkan ini di atas
import { AppSettings } from './../../config/app-settings.js';
import { useAuth } from '../../context/authContext.jsx';
import { loginAPI } from '../../config/api';

function Login() {
  const context = useContext(AppSettings);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    context.handleSetAppHeaderNone(true);
    context.handleSetAppSidebarNone(true);
    context.handleSetAppContentClass('p-0');

    return function cleanUp() {
      context.handleSetAppHeaderNone(false);
      context.handleSetAppSidebarNone(false);
      context.handleSetAppContentClass('');
    };
  }, [context]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError("Nama dan PIN wajib diisi");
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError("PIN minimal 4 karakter");
      setLoading(false);
      return;
    }

    try {
      const res = await loginAPI({ username, password });

      if (!res.success) {
        setError(res.message);
        setLoading(false);
        return;
      }

      login(res.user); // Simpan data user ke context/state
      
      // Logika Redirect berdasarkan Role
      const role = res.user.role.toUpperCase();
      if (role === 'OWNER') {
        navigate('/dashboard'); // Dashboard ALL
      } else if (role === 'ADMIN') {
        navigate('/pos/customer-order'); // Sesuai dengan rute POS lengkap
      } else if (role === 'CAPSTER') {
        navigate('/dashboard-capster'); // Dashboard Pribadi
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Terjadi kesalahan server");
    }

    setLoading(false);
  }

  if (user) {
    const role = user.role.toUpperCase();
    if (role === 'ADMIN') return <Navigate to="/pos/customer-order" replace />;
    if (role === 'CAPSTER') return <Navigate to="/dashboard/v3" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login login-v1">
      <div className="login-container">
        <div className="login-header">
          <div className="brand">
            <div className="d-flex align-items-center">Kedai Tjoekoer MANA</div>
            <small>Pantang Pulang Sebelum Ganteng</small>
          </div>
          <div className="icon"><i className="fa fa-lock"></i></div>
        </div>
        <div className="login-body">
          <div className="login-content fs-13px">
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="form-floating mb-20px">
                <input type="text" className="form-control fs-13px h-45px" placeholder="User Name"
                  onChange={(e) => setUsername(e.target.value)} required />
                <label>User Name</label>
              </div>
              <div className="form-floating mb-20px">
                <input type="password" className="form-control fs-13px h-45px" placeholder="PIN"
                  onChange={(e) => setPassword(e.target.value)} required />
                <label>PIN</label>
              </div>
              <div className="login-buttons">
                <button type="submit" className="btn h-45px btn-theme d-block w-100 btn-lg" disabled={loading}>
                  {loading ? 'Loading...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
