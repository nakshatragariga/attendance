import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, Camera, ChevronDown } from 'lucide-react';
import { loginUser } from '../services/authService';
import heroImage from '../assets/login-hero-new.png';

export default function Login({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState('bunny@1234'); // Default from image
    const [password, setPassword] = useState('*****'); // Placeholder from image
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await loginUser(email, password);
            if (onLogin) onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-dark)', color: 'white', fontFamily: 'var(--font-inter)' }}>
            <div className="bg-mesh" />
            
            {/* Left Hero Side */}
            <div style={{ 
                flex: 1.2, 
                position: 'relative', 
                overflow: 'hidden',
                backgroundColor: 'var(--bg-dark)'
            }}>
                <img 
                    src={heroImage} 
                    alt="Hero" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to right, #030712 0%, rgba(3, 7, 18, 0.5) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                            <div style={{ width: '56px', height: '56px', background: 'var(--primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(59, 130, 246, 0.4)' }}>
                                <Camera color="white" size={28} />
                            </div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '1px', color: 'white', margin: 0 }}>AI ATTEND</h2>
                        </div>
                        <h1 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '24px', lineHeight: 1.05, color: 'white' }}>
                            Smart Campus <br />
                            <span style={{ color: 'var(--primary)' }}>Attendance</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '520px', lineHeight: 1.6, fontWeight: '400' }}>
                            Secure, efficient, and touchless attendance powered by state-of-the-art face recognition technology.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Form Side */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '60px',
                zIndex: 1,
                background: 'var(--bg-dark)'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ 
                        width: '100%', 
                        maxWidth: '420px',
                    }}
                >
                    <div style={{ marginBottom: '48px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Sign in to continue to your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                    <Mail size={20} />
                                </div>
                                <input
                                    className="glass-input"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ paddingLeft: '52px', height: '56px' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                                    <Lock size={20} />
                                </div>
                                <input
                                    className="glass-input"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingLeft: '52px', height: '56px' }}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-red)', fontSize: '0.9rem', padding: '14px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                <AlertCircle size={18} /> {error}
                            </motion.div>
                        )}

                        <button className="glass-button" type="submit" disabled={loading} style={{ width: '100%', height: '58px', marginTop: '12px', fontSize: '1.1rem' }}>
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Don't have an account yet?{' '}
                        <button 
                            onClick={onSwitchToRegister} 
                            style={{ 
                                color: 'var(--primary)', 
                                cursor: 'pointer', 
                                fontWeight: '700', 
                                background: 'none', 
                                border: 'none', 
                                padding: '0',
                                marginLeft: '6px' 
                            }}
                        >
                            Create Account
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
