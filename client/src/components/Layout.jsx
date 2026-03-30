import { motion } from 'framer-motion';
import { Camera, Users, PieChart, Settings, LogOut, CheckCircle, User } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <motion.div
        whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        onClick={onClick}
        className={`flex items-center gap-3 p-3 px-4 rounded-xl cursor-pointer transition-colors ${active ? 'text-primary' : 'text-gray-400'}`}
        style={{
            backgroundColor: active ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            cursor: 'pointer',
            margin: '4px 0',
            transition: 'all 0.2s'
        }}
    >
        <Icon size={20} style={{ color: active ? 'var(--primary)' : 'inherit' }} />
        <span className="font-medium" style={{ color: active ? 'var(--text-main)' : 'inherit' }}>{label}</span>
    </motion.div>
);

export default function Layout({ children, activeTab, onTabChange, user, onLogout }) {
    const allItems = [
        { id: 'dashboard', label: 'Dashboard', icon: PieChart, roles: ['TEACHER', 'STUDENT'] },
        { id: 'register', label: 'Face Registration', icon: Users, roles: ['TEACHER'] },
        { id: 'students', label: 'Manage Students', icon: Users, roles: ['TEACHER'] },
        { id: 'attendance', label: 'Records', icon: CheckCircle, roles: ['TEACHER', 'STUDENT'] },
        { id: 'settings', label: 'System Settings', icon: Settings, roles: ['TEACHER'] },
    ];

    const menuItems = allItems.filter(item => item.roles.includes(user?.role));

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            <div className="bg-mesh" />

            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'var(--sidebar-bg)',
                borderRight: '1px solid var(--border-glass)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                height: '100vh',
                position: 'sticky',
                top: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)' }}>
                        <Camera color="white" size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>AI Attend</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="var(--primary)" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.role === 'TEACHER' ? 'Teacher' : user?.role}</p>
                    </div>
                </div>

                <nav style={{ flex: 1 }}>
                    {menuItems.map(item => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeTab === item.id}
                            onClick={() => onTabChange(item.id)}
                        />
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
                    <SidebarItem icon={LogOut} label="Logout" onClick={onLogout} />
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ maxWidth: '1200px', margin: '0 auto' }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
