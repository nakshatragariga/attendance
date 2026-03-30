import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RegisterFace from './components/RegisterFace';
import AttendanceTable from './components/AttendanceTable';
import SystemSettings from './pages/SystemSettings';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, login, logout, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRegistering, setIsRegistering] = useState(false);

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;

  if (!user) {
    if (isRegistering) {
      return <Register onSwitchToLogin={() => setIsRegistering(false)} />;
    }
    return <Login onLogin={login} onSwitchToRegister={() => setIsRegistering(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'register':
        return <RegisterFace />;
      case 'attendance':
        return (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '32px' }}>Attendance Logs</h1>
            <AttendanceTable />
          </div>
        );
      case 'settings':
        return <SystemSettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} user={user} onLogout={logout}>
      {renderContent()}
    </Layout>
  );
}

export default App;
