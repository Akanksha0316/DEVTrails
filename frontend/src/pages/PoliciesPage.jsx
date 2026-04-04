import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Info, CheckCircle2, FileText, Activity, ChevronLeft, Zap, TrendingUp, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

function PoliciesPage({ user, token }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [riskMetrics, setRiskMetrics] = useState({ premium: 120, formula: '' });

  if (!user) return null;

  const fetchData = async () => {
    try {
      const { data: preview } = await axios.post('/api/premium-preview', {
        location: user.location,
        workType: user.workType
      });
      setRiskMetrics({ premium: preview.premium, formula: preview.formula });

      const { data: userPolicies } = await axios.get('/api/policies', {
        headers: { Authorization: token }
      });
      setPolicies(userPolicies);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, token]);

  const buyPolicy = async (tier) => {
    setLoading(true);
    try {
      await axios.post('/api/policy', { tier }, {
        headers: { Authorization: token }
      });
      setSuccess(tier);
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      alert('Error purchasing protocol');
    } finally {
      setLoading(false);
    }
  };

  // Tier Data
  const tiers = [
    { name: 'Basic', mult: 0.8, coverage: '₹3,000', icon: <ShieldCheck size={24} />, color: 'var(--text-muted)' },
    { name: 'Elite', mult: 1.0, coverage: '₹5,000', icon: <Zap size={24} />, color: 'var(--primary)', popular: true },
    { name: 'Enterprise', mult: 1.6, coverage: '₹10,000', icon: <TrendingUp size={24} />, color: 'var(--secondary)' },
  ];

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '50px' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px' }}>
          <ChevronLeft size={16} /> Back to Hub
        </Link>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: '900', letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>Global Protocols</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>Activate automated protection via the distributed parametric network.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px', marginBottom: '50px' }}>
        
        {/* Tier Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
           {tiers.map((t, i) => {
              const finalPremium = Math.round(riskMetrics.premium * t.mult);
              return (
                <div key={i} className="glass hover-glow" style={{ padding: '35px', display: 'flex', flexDirection: 'column', border: t.popular ? '2px solid var(--primary)' : '1px solid var(--border)', position: 'relative' }}>
                   {t.popular && <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '900', letterSpacing: '0.1em' }}>RECOMMENDED</div>}
                   
                   <div style={{ color: t.color, marginBottom: '20px' }}>{t.icon}</div>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '10px', fontFamily: 'Outfit' }}>{t.name} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>P3</span></h3>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.5' }}>Parametric threshold triggered at {t.coverage} ceiling.</p>
                   
                   <div style={{ fontSize: '2.5rem', fontWeight: '900', fontFamily: 'Outfit', display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '30px' }}>
                      <span style={{ fontSize: '1rem', color: t.color }}>₹</span>{finalPremium}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>/week</span>
                   </div>

                   <button 
                    onClick={() => buyPolicy(t.name)} 
                    className="premium-btn" 
                    style={{ width: '100%', padding: '15px 0', fontSize: '0.9rem', justifyContent: 'center', opacity: success === t.name ? 0.6 : 1 }}
                    disabled={loading || success}
                   >
                     {success === t.name ? 'Protocol Active' : (loading ? 'Syncing...' : 'Initialize')}
                   </button>
                </div>
              );
           })}
        </div>

        {/* Risk Detail Sidebar */}
        <div className="glass" style={{ padding: '30px', height: 'fit-content', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
           <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: '800', marginBottom: '20px', fontSize: '0.9rem' }}>
              <ShieldAlert size={18} color="var(--primary)" /> Neural Risk Breakdown
           </h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <RiskFactor label="Sector Factor" weight="High" offset="-₹30" />
              <RiskFactor label="Location Factor" weight={user.location.toUpperCase()} offset="+₹50" />
              <RiskFactor label="Env Sensitivity" weight="Active" offset="x1.0" />
           </div>
           <div style={{ marginTop: '25px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--primary)', lineHeight: '1.4' }}>
              // SYNC_FORMULA:<br/>
              {riskMetrics.formula}
           </div>
        </div>
      </div>

      {/* Policies Ledger */}
      <div className="glass" style={{ padding: '40px' }}>
        <h3 style={{ marginBottom: '35px', fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '15px' }}>
           <FileText size={24} color="var(--primary)" /> Active Protection Ledger
        </h3>
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  <th style={{ padding: '20px 0' }}>Protocol Tier</th>
                  <th>Premium (Weekly)</th>
                  <th>Payout Cap</th>
                  <th>Contract Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '700' }}>No active protocols detected in this sector.</td></tr>
                ) : (
                  policies.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '25px 0', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                           <ShieldCheck size={20} color="var(--primary)" />
                        </div>
                        <div>
                           <p style={{ fontWeight: '800', color: 'white', fontSize: '1.1rem' }}>{p.tier || 'Elite'}</p>
                           <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>HASH: {p.id.toUpperCase()}</p>
                        </div>
                      </td>
                      <td style={{ fontWeight: '900', fontSize: '1.2rem', color: 'white' }}>₹{p.premium}</td>
                      <td style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--accent)' }}>₹{p.coverage}</td>
                      <td>
                        <span className="badge badge-success">
                          <Activity size={12} style={{ marginRight: '6px' }} /> SYNCHRONIZED
                        </span>
                      </td>
                    </tr>
                  )).reverse()
                )}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function RiskFactor({ label, weight, offset }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
       <span style={{ color: 'var(--text-muted)' }}>{label}</span>
       <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: 'white', fontWeight: '800' }}>{weight}</span>
          <span style={{ color: offset.includes('+') ? 'var(--secondary)' : (offset.includes('x') ? 'var(--primary)' : 'var(--accent)'), fontWeight: '900', fontSize: '0.7rem' }}>{offset}</span>
       </div>
    </div>
  );
}

export default PoliciesPage;
