import { useState, useEffect } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         const role = localStorage.getItem('role');
    //         if (role === 'guru') navigate('/guru/dashboard');
    //         else if (role === 'ortu') navigate('/ortu/dashboard');
    //         else if (role === 'admin') navigate('/admin/dashboard');
    //     }
    // }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowError(false);

        if (!email && !password) {
            setError('Email dan password belum diisi.');
            setShowError(true);
            setLoading(false);
            return;
        }
        if (!email) {
            setError('Email belum diisi.');
            setShowError(true);
            setLoading(false);
            return;
        }
        if (!password) {
            setError('Password belum diisi.');
            setShowError(true);
            setLoading(false);
            return;
        }

        try {
            const trimmedEmail = email.trim();
            const response = await api.post('/auth/login', { email: trimmedEmail, password });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', response.data.user.role);
            localStorage.setItem('nama', response.data.user.nama);

            const role = response.data.user.role;
            if (role === 'guru') navigate('/guru/dashboard');
            if (role === 'ortu') navigate('/ortu/dashboard');
            if (role === 'admin') navigate('/admin/dashboard');

        } catch (err) {
            setShowError(true);
            setError('Email atau password salah. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Header */}
            <div className="login-header">
                <h1 className="login-title">SNBP Monitor</h1>
                <p className="login-subtitle">Sistem Cerdas Kesiapan Siswa</p>
            </div>

            {/* Card */}
            <div className="login-card">
                <h2 className="login-card-title">Masuk ke akun Anda</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            placeholder="sari.rahayu@sman1yk.sch.id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            placeholder="••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'Memeriksa...' : 'Masuk'}
                    </button>
                </form>

                <p className="login-forgot">
                    Lupa password?{' '}
                    <a href="#reset" className="login-reset-link">Reset di sini</a>
                </p>
            </div>

            {/* Error Banner */}
            {showError && error && (
                <div className="error-banner" role="alert">
                    <span className="error-icon">⚠</span>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
