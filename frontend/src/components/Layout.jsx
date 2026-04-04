import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Home, FileText, CreditCard, LogOut, BarChart3, User, Activity, Globe } from 'lucide-react';

function Layout({ user, logout }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-deep)', color: 'var(--text-bright)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '300px', 
        background: 'rgba(3, 7, 18, 0.8)', 
        borderRight: '1px solid var(--border)', 
        padding: '50px 25px', 
        display: 'flex', 
        flexDirection: 'column', 
        backdropFilter: 'blur(30px)', 
        position: 'fixed', 
        height: '100vh', 
        zIndex: 100 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--primary)', marginBottom: '50px' }}>
          <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <Shield size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.02em', color: 'white', fontFamily: 'Outfit' }}>WorkerGuard</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '2px' }}>
              <div style={{ width: '6px', height: '6px', background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent)' }}></div>
              Neural Link: Active
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <SidebarLink to="/dashboard" icon={<Home size={20} />} label="Executive Hub" />
          <SidebarLink to="/policies" icon={<FileText size={20} />} label="Global Policies" />
          <SidebarLink to="/claims" icon={<CreditCard size={20} />} label="Payout Ledger" />
          <SidebarLink to="/analytics" icon={<BarChart3 size={20} />} label="Risk Intelligence" />
          <SidebarLink to="/ledger" icon={<Globe size={20} />} label="Global Ledger" />
          <SidebarLink to="/profile" icon={<User size={20} />} label="Identity Profile" />
        </nav>

        <div style={{ marginTop: 'auto', background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '20px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ 
              width: '45px', 
              height: '45px', 
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
              borderRadius: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: '900',
              color: 'white',
              fontSize: '1.2rem',
              boxShadow: '0 5px 15px rgba(59, 130, 246, 0.3)'
            }}>
               {user?.name ? user.name[0].toUpperCase() : '?'}
            </div>
            <div>
              <p style={{ fontWeight: '800', fontSize: '0.9rem', color: 'white' }}>{user?.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{user?.workType} Sector</p>
            </div>
          </div>
          <button onClick={handleLogout} className="premium-btn" style={{ width: '100%', height: '45px', fontSize: '0.75rem', padding: '0', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogOut size={16} /> Termination
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '300px', flex: 1, padding: '60px', minHeight: '100vh', background: 'var(--bg-deep)' }}>
        <Outlet />
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px', 
        padding: '14px 20px', 
        textDecoration: 'none', 
        color: isActive ? 'white' : 'var(--text-muted)', 
        borderRadius: '14px',
        background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        fontWeight: isActive ? '800' : '600',
        fontSize: '0.9rem',
        fontSize: '0.9rem',
        fontFamily: 'Outfit',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <span style={{ color: isActive ? 'var(--primary)' : 'inherit', display: 'flex', alignItems: 'center' }}>{icon}</span> 
      {label}
    </Link>
  );
}

export default Layout;
