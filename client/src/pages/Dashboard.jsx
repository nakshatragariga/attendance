import { useState, useEffect } from 'react';
import CameraCapture from "../components/CameraCapture";
import AttendanceTable from "../components/AttendanceTable";
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Percent } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className="glass-panel" style={{ padding: '24px', flex: 1, display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px' }}>
            <Icon color={color} size={24} />
        </div>
        <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '500' }}>{label}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)' }}>{value}</h3>
            {subtitle && <p style={{ fontSize: '0.75rem', color: color, marginTop: '4px', fontWeight: '600' }}>{subtitle}</p>}
        </div>
    </div>
);

export default function Dashboard() {
    const [stats, setStats] = useState({ totalPresent: 0, totalDays: 0, percentage: 0, statusLabel: 'Loading...' });
    const [lowAttendanceStudents, setLowAttendanceStudents] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = user?.id || user?.uid || user?._id;
                if (userId) {
                    const statsRes = await API.get(`/attendance/stats/${userId}`);
                    setStats(statsRes.data);

                    if (user.role === 'TEACHER') {
                        const reportRes = await API.get('/attendance/reports/low-attendance?threshold=75.0');
                        setLowAttendanceStudents(reportRes.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };
        if (user) fetchData();
    }, [user]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

            {/* Header Info */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>System Overview</h1>
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Real-time face recognition and attendance monitoring active.</p>
                </div>
                <div className="status-badge">
                    <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 8px var(--primary)' }} />
                    SYSTEM OPERATIONAL
                </div>
            </header>

            {/* Stats Grid */}
            <div style={{ display: 'flex', gap: '24px' }}>
                <StatCard
                    icon={Calendar}
                    label="Total Attendance"
                    value={`${stats.totalPresent} / ${stats.totalDays}`}
                    color="var(--primary)"
                    subtitle="Days Present"
                />
                <StatCard
                    icon={Percent}
                    label="Attendance Rate"
                    value={`${stats.percentage}%`}
                    color={stats.percentage >= 75 ? "var(--primary)" : "var(--accent-red)"}
                    subtitle={stats.statusLabel}
                />
                <StatCard
                    icon={TrendingUp}
                    label="Status"
                    value={stats.percentage >= 75 ? "Good" : "Warning"}
                    color={stats.percentage >= 75 ? "var(--primary)" : "var(--accent-yellow)"}
                    subtitle="Based on 75% goal"
                />
            </div>

            {/* Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '40px' }}>

                {/* Left Section: Activity/Camera */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="glass-panel" style={{ padding: '32px', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '24px' }}>Today's Attendance Activity</h2>

                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ opacity: 0.5, textAlign: 'center' }}>
                                <CameraCapture />
                                <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>No activity data available</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Right Section: Insights & Reports */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* System Insights */}
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>System Insights</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="insight-item">
                                <div className="insight-dot" style={{ background: 'var(--primary)' }} />
                                <p style={{ color: 'var(--text-main)', fontWeight: '600' }}>{stats.totalPresent} students present today.</p>
                            </div>
                            <div className="insight-item">
                                <div className="insight-dot" style={{ background: 'var(--accent-red)' }} />
                                <p style={{ color: 'var(--text-main)', fontWeight: '600' }}>{stats.totalDays - stats.totalPresent} students absent today.</p>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '8px' }}>
                                Overview of today's campus attendance participation.
                            </p>
                        </div>
                    </div>

                    {/* Low Attendance Report */}
                    {user?.role === 'TEACHER' && (
                        <div style={{ marginTop: '16px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Low Attendance Report (&lt; 75%)</h2>
                            <div className="glass-panel" style={{ padding: '24px' }}>
                                {lowAttendanceStudents.length > 0 ? (
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                                                <th style={{ padding: '12px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Student</th>
                                                <th style={{ padding: '12px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lowAttendanceStudents.map(student => (
                                                <tr key={student.userId} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                                    <td style={{ padding: '12px', fontWeight: '500' }}>{student.name}</td>
                                                    <td style={{ padding: '12px', color: 'var(--accent-yellow)', fontWeight: '700' }}>{student.attendancePercentage}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No students with low attendance.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {user?.role !== 'TEACHER' && (
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Recent Activity</h2>
                            <AttendanceTable />
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
