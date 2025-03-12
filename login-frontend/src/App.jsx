import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'https://toystorebackend.onrender.com';
const GOOGLE_CLIENT_ID = '1027572672777-2f5avgdj0k6tso1c19eqgqrm6q6vpf9p.apps.googleusercontent.com';

// Página de Login
function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(`${API_URL}/login`, { username, password });
            navigate('/dashboard');
        } catch (err) {
            setError('Usuario o contraseña incorrecto');
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API_URL}/google-login`, {
                token: credentialResponse.credential,
            });

            console.log("Usuario autenticado:", res.data.user);
            navigate('/dashboard');
        } catch (err) {
            console.error("Error en la autenticación con Google:", err);
            setError('Error al iniciar sesión con Google');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 text-center" style={{ width: '100%', maxWidth: '400px' }}>
                <h3>Login</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>

                <hr />

                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => setError('Error en Google Login')} />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
}

// Página de Dashboard
function Dashboard() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 text-center" style={{ width: '100%', maxWidth: '400px' }}>
                <h3>Bienvenido</h3>
            </div>
        </div>
    );
}

// Rutas de la Aplicación
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
