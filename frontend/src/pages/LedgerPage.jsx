import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Activity, Globe, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function LedgerPage({ user }) {
  const [ledger, setLedger] = useState([]);
  const [stats, setStats] = useState({ totalProtected: 0, totalSettled: 0, activeTriggers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ledgerData } = await axios.get('/api/ledger-public');
        setLedger(ledgerData);
        
        const { data: statsData } = await axios.get('/api/public-stats');
        setStats(statsData);
      } catch (err) {
        console.error("Failed to sync with global ledger:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // Live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'white' }} className="animate-fade">
      {/* Navbar Minimal */}
      <nav style={{ padding: '25px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(30px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'white' }}>
          <Shield size={28} color="var(--primary)" />
          <span style={{ fontSize: '1.2rem', fontWeight: '900' }}>WorkerGuard <span style={{ color: 'var(--primary)', fontSize: '0.7rem', verticalAlign: 'middle' }}>LEDGER</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '30px' }}>
           <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '800' }}>Hub</Link>
           <Link to="/auth" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '800' }}>Node Access</Link>
        </div>
      </nav>

      <div style={{ padding: '60px' }}>
        <div style={{ marginBottom: '60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
           <StatCard label="Global Protected Nodes" value={stats.totalProtected} icon={<Globe color="var(--primary)" />} />
           <StatCard label="System Disbursements" value={`₹${stats.totalSettled}`} icon={<TrendingUp color="var(--accent)" />} />
           <StatCard label="Active Parametric Triggers" value={stats.activeTriggers} icon={<Zap color="var(--secondary)" />} />
        </div>

        <div className="glass" style={{ padding: '50px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
             <h2 style={{ fontSize: '2rem', fontWeight: '900', fontFamily: 'Outfit' }}>Real-Time Protocol Settlements</h2>
             <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '0.1em', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                NETWORK STATUS: STABLE
             </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  <th style={{ padding: '20px' }}>Verified Node</th>
                  <th>Atmospheric Trigger</th>
                  <th>Settlement Amount</th>
                  <th>Verification Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ledger.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '50px', textAlign: 'center', color: 'var(--text-muted)' }}>Synchronizing with Global Node Network...</td></tr>
                ) : (
                  ledger.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                         <div style={{ width: '35px', height: '35px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Activity size={18} color="var(--primary)" />
                         </div>
                         <span style={{ fontWeight: '800', fontFamily: 'monospace' }}>{c.node}</span>
                      </td>
                      <td style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>{c.reason.split(':').pop()}</td>
                      <td style={{ fontWeight: '900', color: 'var(--accent)', fontSize: '1.2rem' }}>+₹{c.amount}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(c.time).toLocaleTimeString()}</td>
                      <td>
                        <span className="badge badge-success">CLEARED</span>
                      </td>
                    </tr>
                  )).reverse()
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="glass hover-glow" style={{ padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{label}</p>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '900', fontFamily: 'Outfit' }}>{value}</h3>
       </div>
       <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '14px', border: '1px solid var(--border)' }}>
          {icon}
       </div>
    </div>
  );
}

export default LedgerPage;
