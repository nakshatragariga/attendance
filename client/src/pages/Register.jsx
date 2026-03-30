import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import { registerUser } from '../services/authService';
import heroImage from '../assets/login-hero.png';

export default function Register({ onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const [section, setSection] = useState('A');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await registerUser(name, email, password, role, role === 'STUDENT' ? section : null);
            setSuccess('Registration successful! You can now sign in.');
            setName('');
            setEmail('');
            setPassword('');
            setRole('STUDENT');
            setSection('A');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-dark)' }}>
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
                    background: 'linear-gradient(to right, #030712 0%, rgba(3, 7, 18, 0.4) 60%, transparent 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
                                <Camera color="white" size={24} />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '1px', color: 'white', margin: 0 }}>AI ATTEND</h2>
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '24px', lineHeight: 1.1, color: 'white' }}>
                            Join the <br />
                            <span style={{ color: 'var(--primary)' }}>Future</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '480px', lineHeight: 1.6 }}>
                            Register today to experience seamless, AI-powered attendance tracking on campus.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Form Side */}
            <div style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                padding: '40px',
                zIndex: 1,
                background: 'var(--bg-dark)'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel"
                    style={{ 
                        padding: '48px', 
                        width: '100%', 
                        maxWidth: '440px',
                        background: 'var(--bg-card)',
                        borderColor: 'var(--border-glass)' 
                    }}
                >
                    <div style={{ marginBottom: '32px' }}>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Get started with your student or agent account</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="glass-input" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required style={{ paddingLeft: '44px', height: '48px' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="glass-input" type="email" placeholder="name@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: '44px', height: '48px' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input className="glass-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingLeft: '44px', height: '48px' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>Account Role</label>
                            <select 
                                className="glass-input" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                style={{ width: '100%', cursor: 'pointer', height: '48px', background: 'var(--bg-dark)' }}
                            >
                                <option value="STUDENT">Student</option>
                                <option value="TEACHER">Teacher (Admin)</option>
                            </select>
                        </div>

                        {role === 'STUDENT' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                style={{ overflow: 'hidden' }}
                            >
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-main)' }}>Section</label>
                                <select 
                                    className="glass-input" 
                                    value={section} 
                                    onChange={(e) => setSection(e.target.value)}
                                    style={{ width: '100%', cursor: 'pointer', height: '48px', background: 'var(--bg-dark)' }}
                                >
                                    <option value="A">Section A</option>
                                    <option value="B">Section B</option>
                                    <option value="C">Section C</option>
                                </select>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-red)', fontSize: '0.875rem', padding: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}

                        {success && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.875rem', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                <CheckCircle size={16} /> {success}
                            </motion.div>
                        )}

                        <button className="glass-button" type="submit" disabled={loading} style={{ width: '100%', height: '52px', marginTop: '8px', fontSize: '1rem', fontWeight: '600' }}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '32px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        Already have an account?{' '}
                        <button 
                            onClick={onSwitchToLogin} 
                            style={{ 
                                color: 'var(--primary)', 
                                cursor: 'pointer', 
                                fontWeight: '600', 
                                background: 'none', 
                                border: 'none', 
                                padding: '0',
                                marginLeft: '4px' 
                            }}
                        >
                            Log In
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
