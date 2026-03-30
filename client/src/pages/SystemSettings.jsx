import { useState } from "react";
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SystemSettings() {
    const { logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [status, setStatus] = useState(null);

    const handleReset = async () => {
        setLoading(true);
        try {
            await API.post("/system/reset");
            setStatus("System has been fully reset. Logging you out...");
            setTimeout(() => {
                logout();
            }, 3000);
        } catch (err) {
            console.error(err);
            setStatus("Failed to reset system. Check logs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '32px' }}>System Settings</h1>

            <div className="glass-panel" style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '32px' }}>
                    <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px' }}>
                        <Trash2 color="#ef4444" size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#ef4444' }}>Danger Zone: Reset All Data</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            This action will permanently delete all registered users, attendance records, and face training data. 
                            This cannot be undone. The system will be returned to its initial clean state.
                        </p>
                    </div>
                </div>

                {!confirming ? (
                    <button 
                        onClick={() => setConfirming(true)}
                        className="glass-button"
                        style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                    >
                        Clear All System Data
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            <AlertTriangle color="#f59e0b" size={20} />
                            <span style={{ fontSize: '0.875rem' }}>Are you absolutely sure? This will wipe the entire system.</span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button 
                                onClick={handleReset}
                                disabled={loading}
                                className="glass-button"
                                style={{ background: '#ef4444', color: 'white', border: 'none' }}
                            >
                                {loading ? 'Processing...' : 'Yes, Reset Everything'}
                            </button>
                            <button 
                                onClick={() => setConfirming(false)}
                                disabled={loading}
                                className="glass-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {status && (
                    <div style={{ marginTop: '24px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center', color: '#10b981' }}>
                        <CheckCircle size={18} />
                        <span style={{ fontSize: '0.875rem' }}>{status}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
