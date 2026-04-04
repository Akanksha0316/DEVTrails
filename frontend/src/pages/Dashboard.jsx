import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, Sun, AlertTriangle, TrendingUp, ShieldCheck, Activity, Zap } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

function Dashboard({ user, token }) {
  const navigate = useNavigate();
  const [weatherInfo, setWeatherInfo] = useState({ status: 'Clear', risk: 1.0 });
  const [stats, setStats] = useState({ activePolicies: 0, totalPayouts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const { data: weather } = await axios.get('/api/weather-impact');
        setWeatherInfo({ status: weather.status, risk: weather.risk });

        const { data: statsData } = await axios.get('/api/stats', {
          headers: { Authorization: token }
        });
        setStats({ 
          activePolicies: statsData.activePolicies, 
          totalPayouts: statsData.totalPayouts 
        });
      } catch (e) {
        console.error("Connectivity issue with Neural Link:", e);
        // Minimal fallback to keep UI alive but visible as error
        setWeatherInfo({ status: 'Sensor Offline', risk: 1.0 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, token]);

  if (!user) return <Navigate to="/auth" />;
  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--primary)' }}>Initializing Neural Link...</div>;

  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: '900', letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>Executive Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
            Welcome back, <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{user.name}</span>. 
            Terminal Status: <span className="badge badge-success" style={{ marginLeft: '10px' }}>Secure Link</span>
          </p>
        </div>
        <div className="glass hover-glow" style={{ padding: '15px 25px', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.05em' }}>
          NETWORK LATENCY: <span style={{ color: 'var(--secondary)' }}>18MS</span>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', marginBottom: '40px' }}>
        {/* Weather Card */}
        <div className="glass pulse" style={{ 
          padding: '35px', 
          display: 'flex', 
          flexDirection: 'column', 
          borderLeft: `4px solid ${weatherInfo.risk > 1 ? 'var(--secondary)' : 'var(--accent)'}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Environment Protocol</span>
            {weatherInfo.status === 'Clear' ? <Sun size={24} color="var(--primary)" /> : <CloudRain size={24} color="var(--secondary)" />}
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', fontFamily: 'Outfit' }}>{weatherInfo.status}</h2>
          <p style={{ color: weatherInfo.risk > 1 ? 'var(--secondary)' : 'var(--accent)', fontWeight: '800', fontSize: '1rem', marginTop: '10px' }}>
            {weatherInfo.risk > 1 ? `Disruption Index: x${weatherInfo.risk}` : 'Optimal Conditions Found'}
          </p>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05 }}>
             {weatherInfo.status === 'Clear' ? <Sun size={120} /> : <CloudRain size={120} />}
          </div>
        </div>

        {/* Stats 1 */}
        <div className="glass hover-glow" style={{ padding: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Smart Contracts</span>
            <ShieldCheck size={24} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', fontFamily: 'Outfit' }}>{stats.activePolicies}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600', marginTop: '10px' }}>
            Sector Tier: <span style={{ color: 'white' }}>{user.workType} Priority</span>
          </p>
        </div>

        {/* Stats 2 */}
        <div className="glass hover-glow" style={{ padding: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Disbursed Capital</span>
            <TrendingUp size={24} color="var(--accent)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent)' }}>₹</span>
            <h2 style={{ fontSize: '3rem', fontWeight: '900', fontFamily: 'Outfit' }}>{stats.totalPayouts}</h2>
          </div>
          <p style={{ color: 'var(--accent)', fontSize: '0.95rem', fontWeight: '700', marginTop: '10px' }}>Verified via Parametric Trigger</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginBottom: '40px' }}>
        {/* Risk Analysis Card */}
        <div className="glass" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'Outfit', fontSize: '1.5rem' }}>
              <AlertTriangle size={24} color="var(--secondary)" /> Neural Risk Profile
            </h3>
            <div style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', fontSize: '0.6rem', color: 'var(--accent)', fontWeight: '900', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
               AI OPTIMIZED
            </div>
          </div>
          <div style={{ padding: '25px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
             <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '20px' }}>
               Our proprietary intelligence algorithms have cross-referenced your deployment location (<span style={{ color: 'var(--primary)', fontWeight: '800' }}>{user.location}</span>) with current atmospheric data. 
               Risk coefficient for <span style={{ color: 'white', fontWeight: '700' }}>{user.workType}</span> operations is currently <span style={{ color: weatherInfo.risk > 1 ? 'var(--secondary)' : 'var(--accent)', fontWeight: '900' }}>{(weatherInfo.risk * 10).toFixed(1)}%</span>.
             </p>
             
             <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '12px', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--primary)' }}>
                <span style={{ color: 'var(--text-muted)' }}>// AI Risk Formula:</span><br/>
                PREMIUM = BaseRate({user.workType}) * LocFactor({user.location}) * EnvIndex({weatherInfo.status})
             </div>

             <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', marginTop: '30px', overflow: 'hidden' }}>
                <div style={{ width: `${(weatherInfo.risk / 2) * 100}%`, height: '100%', background: 'linear-gradient(to right, var(--primary), var(--secondary))', boxShadow: '0 0 15px var(--primary-glow)' }}></div>
             </div>
          </div>
        </div>

        {/* Live Feed Card */}
        <div className="glass" style={{ padding: '40px' }}>
           <h3 style={{ marginBottom: '30px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'Outfit' }}>
              <Activity size={22} color="var(--primary)" /> Global Sync Feed
           </h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <ActivityItem text="Settlement: ₹500 transferred to swiggy.node_24" time="2m ago" />
              <SidebarLinkPlaceholder text="Smart Policy Initialized: Mumbai Sector" time="5m ago" />
              <ActivityItem text="Parametric Trigger: Heavy Rain (Delhi)" time="12m ago" />
              <ActivityItem text="Neural Link Synchronized" time="45m ago" />
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ marginBottom: '30px', fontFamily: 'Outfit', fontSize: '1.5rem' }}>Emergency Hub Protocols</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px' }}>
        <ActionCard title="Expansion Protocol" desc="Optimize coverage limits or adjust risk factors." onAction={() => navigate('/policies')} icon={<ShieldCheck size={28} color="var(--primary)" />} />
        <ActionCard title="Automation Logs" desc="Review historical triggers and automated disbursements." onAction={() => navigate('/claims')} icon={<TrendingUp size={28} color="var(--secondary)" />} />
      </div>
    </div>
  );
}

function ActionCard({ title, desc, onAction, icon }) {
    return (
        <div className="glass hover-glow" style={{ padding: '35px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '30px' }} onClick={onAction}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>{icon}</div>
            <div>
                 <h4 style={{ marginBottom: '8px', fontSize: '1.3rem', fontFamily: 'Outfit', fontWeight: '800' }}>{title}</h4>
                 <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '500' }}>{desc}</p>
            </div>
        </div>
    );
}

function ActivityItem({ text, time }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '0.9rem', paddingBottom: '15px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }}></div>
        <span style={{ color: 'white', fontWeight: '500', lineHeight: '1.4' }}>{text}</span>
      </div>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', whiteSpace: 'nowrap', marginLeft: '15px' }}>{time}</span>
    </div>
  );
}

function SidebarLinkPlaceholder({ text, time }) { return <ActivityItem text={text} time={time} />; }

export default Dashboard;
