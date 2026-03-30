import { useState, useEffect } from "react";
import { RefreshCw, User, Calendar, Clock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { getAttendance, getUsers } from "../services/attendanceService";
import { useAuth } from "../context/AuthContext";

export default function AttendanceTable() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const [attendanceRes, usersRes] = await Promise.all([
                getAttendance(),
                getUsers()
            ]);
            
            // Map userId to name
            const map = {};
            usersRes.data.forEach(u => map[u.id] = u.name);
            setUsersMap(map);

            // Filter for student role
            let logs = attendanceRes.data;
            if (user && user.role === 'STUDENT') {
                logs = logs.filter(l => l.userId === user.id);
            }
            
            setData(logs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="var(--primary)" />
                    {user?.role === 'AGENT' ? 'All Attendance Logs' : 'My Attendance History'}
                </h3>
                <button onClick={load} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '16px 20px', fontWeight: '500' }}>User</th>
                            <th style={{ padding: '16px 20px', fontWeight: '500' }}>Date</th>
                            <th style={{ padding: '16px 20px', fontWeight: '500' }}>Time</th>
                            <th style={{ padding: '16px 20px', fontWeight: '500' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No logs found.
                                </td>
                            </tr>
                        ) : (
                            data.map((a, i) => (
                                <motion.tr
                                    key={a.id || i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{ borderTop: '1px solid var(--border-glass)' }}
                                >
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={14} />
                                            </div>
                                            <span style={{ fontWeight: '500' }}>
                                                {usersMap[a.userId] || `User ${a.userId}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                            <Calendar size={14} /> {a.date}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                                            <Clock size={14} /> {a.time}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span className={`status-badge ${a.status.toLowerCase()}`}>{a.status}</span>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
