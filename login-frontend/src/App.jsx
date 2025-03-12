import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';  // Asegúrate de agregar este archivo para los estilos
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const API_URL = 'https://toystorebackend.onrender.com';

// Página de Login
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(`${API_URL}/login`, { username, password });
            navigate('/dashboard', { state: res.data });
        } catch (err) {
            setError('Usuario o contraseña incorrecto');
        }
    };

    const handleGoogleLogin = (response) => {
        console.log(response);
        if (response.credential) {
            // Aquí puedes enviar el token de Google al backend para validarlo
            axios.post(`${API_URL}/google-login`, { token: response.credential })
                .then((res) => {
                    navigate('/dashboard', { state: res.data });
                })
                .catch((err) => {
                    setError('Error al iniciar sesión con Google');
                });
        }
    };

    return (
        <div className="login-container">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="d-flex align-items-center mb-4">
                        <img src="../img/logo.png" alt="Logo" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                        <h3 className="text-center m-0">Login</h3>
                    </div>
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
                    
                    {/* Botón de inicio de sesión con Google */}
                    <GoogleOAuthProvider clientId="639044841839-ddle5ha663v3qd44d8rphotrnkjj59n9.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={handleGoogleLogin}
                            onError={() => setError('Error al iniciar sesión con Google')}
                            useOneTap
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>
        </div>
    );
}

// Página de Dashboard
function Dashboard() {
    const userData = location?.state || { username: 'Desconocido', password: 'Desconocida' };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="text-center">Datos del Usuario</h3>
                <p><strong>Usuario:</strong> {userData.username}</p>
                <p><strong>Contraseña:</strong> {userData.password}</p>
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
