import { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('Email atau password salah. Silakan coba lagi.');
    const [showError, setShowError] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        navigate('/dashboard');
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

                    <button type="submit" className="btn-login">
                        Masuk
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
                    <span>
                        Email atau password salah.{' '}
                        <strong>Silakan coba lagi.</strong>
                    </span>
                </div>
            )}
        </div>
    );
}
