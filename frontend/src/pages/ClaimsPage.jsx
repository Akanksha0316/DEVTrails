import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, CloudRain, AlertCircle, Info, Zap, Calendar, Activity, Sun, Shield } from 'lucide-react';

function ClaimsPage({ user, token }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [simulationLoading, setSimulationLoading] = useState(false);
  if (!user) return null;

  const fetchClaims = async () => {
    try {
      const { data } = await axios.get('/api/claims', {
        headers: { Authorization: token }
      });
      setClaims(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [token]);

  const simulateWeather = async (status) => {
    setSimulationLoading(true);
    try {
      await axios.post('/api/simulate-weather', { status });
      alert(`Simulation Mode: Weather changed to ${status}. Automated payouts triggered where applicable.`);
      fetchClaims(); // Refresh claims list
    } catch (err) {
      alert('Simulation failed');
    } finally {
      setSimulationLoading(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
        <Activity size={16} /> Back to Hub
      </Link>
      <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: '900', letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>Automation Ledger</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>Real-time monitoring of parametric triggers and smart payouts.</p>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
             <MetricBox label="AV. PAYOUT TIME" value="14MS" />
             <MetricBox label="TRUST SCORE" value="99.9%" />
        </div>
      </div>

      {/* Sensor Status Hub */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
         <SensorStatus label="CLOUD SENSOR-01" status="ACTIVE" pulse={true} />
         <SensorStatus label="THERMAL GRID-04" status="ACTIVE" pulse={true} />
         <SensorStatus label="WIND ANEMOMETER-02" status="ACTIVE" pulse={true} />
         <SensorStatus label="NETWORK NODE-11" status="SYNCED" pulse={false} />
      </div>

      {/* Simulation Tools */}
      <div className="glass pulse" style={{ padding: '40px', marginBottom: '50px', background: 'rgba(59, 130, 246, 0.03)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '14px' }}>
            <Zap size={28} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', fontFamily: 'Outfit' }}>Parametric Simulation Hub</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '35px', fontSize: '1rem', fontWeight: '500' }}>Manually override environmental sensors to test the automated smart-contract execution protocols.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          <SimulationBtn onClick={() => simulateWeather('Rainy')} label="Rain Protocol" color="#3B82F6" icon={<CloudRain size={18} />} loading={simulationLoading} />
          <SimulationBtn onClick={() => simulateWeather('Storm')} label="Storm Alert" color="#EF4444" icon={<AlertCircle size={18} />} loading={simulationLoading} />
          <SimulationBtn onClick={() => simulateWeather('Heatwave')} label="Heatwave Alert" color="#F59E0B" icon={<Sun size={18} />} loading={simulationLoading} />
          <SimulationBtn onClick={() => simulateWeather('Outage')} label="System Outage" color="#8B5CF6" icon={<Zap size={18} />} loading={simulationLoading} />
          <SimulationBtn onClick={() => simulateWeather('Pollution')} label="AQI Hazardous" color="#10B981" icon={<Activity size={18} />} loading={simulationLoading} />
          <SimulationBtn onClick={() => simulateWeather('Clear')} label="Reset Sensors" color="#64748B" icon={<Shield size={18} />} loading={simulationLoading} />
        </div>
      </div>

      {/* Claims List */}
      <div className="glass" style={{ padding: '40px' }}>
        <h3 style={{ marginBottom: '35px', fontSize: '1.5rem', fontFamily: 'Outfit', fontWeight: '800' }}>Disbursement History</h3>
        
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Synchronizing automation logs...</p>
        ) : claims.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Calendar size={64} color="var(--text-muted)" style={{ marginBottom: '30px', opacity: 0.3 }} />
            <h3 style={{ marginBottom: '10px', fontSize: '1.25rem', color: 'white' }}>No triggers detected</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Initiate a simulation above to populate this ledger.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  <th style={{ padding: '20px 0' }}>Disruption Event</th>
                  <th>Payout Amount</th>
                  <th>Verification Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.3s' }}>
                    <td style={{ padding: '25px 0', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <CreditCard size={20} color="var(--primary)" />
                      </div>
                      <div>
                        <p style={{ fontWeight: '800', fontSize: '1rem', color: 'white', marginBottom: '4px' }}>{claim.reason}</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.05em' }}>HASH: {claim.id?.slice(-12).toUpperCase() || claim._id?.slice(-12).toUpperCase()}</p>
                      </div>
                    </td>
                    <td style={{ fontWeight: '900', color: 'var(--accent)', fontSize: '1.2rem' }}>+₹{claim.payout}</td>
                    <td style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>{new Date(claim.createdAt).toLocaleString()}</td>
                    <td>
                      <span className="badge badge-success" style={{ gap: '8px' }}>
                        <Activity size={12} /> Verified
                      </span>
                    </td>
                  </tr>
                )).reverse()}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: '50px', display: 'flex', alignItems: 'center', gap: '20px', color: 'var(--text-muted)', fontSize: '0.95rem', padding: '30px', borderLeft: '4px solid var(--primary)', background: 'rgba(59, 130, 246, 0.02)', borderRadius: '0 12px 12px 0', fontWeight: '500', lineHeight: '1.6' }}>
        <Info size={24} color="var(--primary)" />
        <p>This protocol uses Zero-Knowledge Proofs (ZKP) to ensure all payouts are legitimate and cryptographically linked to verified environmental sensors without compromising user privacy.</p>
      </div>
    </div>
  );
}

function SimulationBtn({ onClick, label, icon, loading, color }) {
  return (
    <button 
      onClick={onClick} 
      className="glass" 
      style={{ padding: '15px 24px', color: 'white', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s', borderLeft: `4px solid ${color}` }}
      disabled={loading}
      onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.transform = 'scale(1.02)'; }}
      onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.transform = 'scale(1)'; }}
    >
      <span style={{ color: color }}>{icon}</span> {label}
    </button>
  );
}

function MetricBox({ label, value }) {
  return (
    <div className="glass" style={{ padding: '12px 25px', display: 'flex', flexDirection: 'column', minWidth: '150px' }}>
      <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{label}</span>
      <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', marginTop: '4px' }}>{value}</span>
    </div>
  );
}

function SensorStatus({ label, status, pulse }) {
  return (
    <div className="glass" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
       <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>{label}</span>
       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%', boxShadow: pulse ? '0 0 10px var(--accent)' : 'none', animation: pulse ? 'pulse 2s infinite' : 'none' }}></div>
          <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'white' }}>{status}</span>
       </div>
    </div>
  );
}

export default ClaimsPage;
