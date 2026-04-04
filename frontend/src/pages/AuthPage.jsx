import React, { useState } from 'react';
import axios from 'axios';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

function AuthPage({ login }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', location: 'low', workType: 'Zomato', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const { data } = await axios.post(endpoint, formData);
      // Auto-login for both login and register
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--bg-deep)', position: 'relative', overflow: 'hidden' }} className="animate-fade">
      {/* Decorative Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(217, 70, 239, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>

      <Link to="/" style={{ position: 'absolute', top: '40px', left: '40px', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', transition: 'all 0.3s', zIndex: 10 }} onMouseEnter={(e) => e.target.style.color = 'white'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
        <ArrowLeft size={18} /> Protocol Hub
      </Link>

      <div className="glass hover-glow" style={{ width: '100%', maxWidth: '1100px', display: 'grid', gridTemplateColumns: 'minmax(500px, 1fr) 1fr', overflow: 'hidden', padding: '0', zIndex: 1, borderRadius: '30px' }}>
        
        {/* Left Side: Form Container */}
        <div style={{ padding: '60px', borderRight: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ marginBottom: '45px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '20px', marginBottom: '25px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <Shield size={42} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '2.8rem', fontWeight: '900', letterSpacing: '-0.03em', marginBottom: '10px', color: 'white', fontFamily: 'Outfit' }}>{isLogin ? 'Secure Gateway' : 'Identity Protocol'}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>
              {isLogin ? 'Access your parametric coverage' : 'Initialize your worker identity'}
            </p>
          </div>

          {error && <div style={{ background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)', padding: '18px', borderRadius: '14px', marginBottom: '35px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: '700', fontSize: '0.95rem', animation: 'slideUp 0.3s ease' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ position: 'relative' }}>
              <label style={{ color: 'white', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Legal Identity Name</label>
              <input 
                type="text" 
                placeholder="e.g. Nikita Varma" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 20px', color: 'white', width: '100%', fontSize: '1rem', transition: 'all 0.3s' }}
              />
            </div>

            {!isLogin && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                  <label style={{ color: 'white', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Operational Risk</label>
                  <select 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 15px', color: 'white', width: '100%', fontSize: '0.95rem', cursor: 'pointer' }}
                  >
                    <option value="low">Suburbs (Low)</option>
                    <option value="medium">City (Medium)</option>
                    <option value="high">Complex (High)</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: 'white', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Service Sector</label>
                  <select 
                    value={formData.workType} 
                    onChange={(e) => setFormData({...formData, workType: e.target.value})}
                    style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 15px', color: 'white', width: '100%', fontSize: '0.95rem', cursor: 'pointer' }}
                  >
                    <option value="Zomato">Zomato</option>
                    <option value="Swiggy">Swiggy</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Blinkit">Blinkit</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>
            )}

            <div>
              <label style={{ color: 'white', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Neural Passcode</label>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '16px 20px', color: 'white', width: '100%', fontSize: '1rem', transition: 'all 0.3s' }}
              />
            </div>

            <button type="submit" className="premium-btn" style={{ marginTop: '10px', width: '100%', height: '60px', fontSize: '1.1rem', justifyContent: 'center', borderRadius: '16px' }} disabled={loading}>
              {loading ? 'Verifying Identity...' : (isLogin ? 'Authenticate' : 'Initialize Protocol')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)', fontSize: '1rem' }}>
            {isLogin ? "New user? " : "Already initialized? "}
            <span 
              className="hover-glow"
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '800', borderBottom: '2px solid rgba(59, 130, 246, 0.3)', transition: 'all 0.3s', paddingBottom: '2px' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register Protocol' : 'Identity Check-in'}
            </span>
          </div>
        </div>

        {/* Right Side: Information Panel */}
        <div style={{ padding: '60px', background: 'rgba(59, 130, 246, 0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
           <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '12px 24px', borderRadius: '12px', marginBottom: '40px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.15)', fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '0.2em' }}>
             SYSTEM STATUS: NEURAL-CHECK v2.4.1 [ACTIVE]
           </div>

           <h3 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '35px', color: 'white', fontFamily: 'Outfit' }}>Phase 2 Requirements</h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <AuthRequirementItem title="Global Identity Sync" desc="Unified worker profile verified across Zomato, Swiggy, and Amazon sectors." active={true} />
              <AuthRequirementItem title="Risk Zone Allocation" desc="Precise premium calibration based on location-specific meteorological volatility." active={!isLogin} />
              <AuthRequirementItem title="Smart Settlement Ready" desc="Pre-authorized wallet protocols for instant parametric disbursements." active={!isLogin} />
              <AuthRequirementItem title="ZKP Neural Encryption" desc="Zero-Knowledge Proof verified transactions protecting your worker metadata." active={true} />
           </div>

           {!isLogin && (
             <div style={{ marginTop: '50px', padding: '25px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.9rem' }}>
               <p style={{ color: 'var(--accent)', fontWeight: '900', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neural Link Preview</p>
               <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontWeight: '600' }}>
                 <span>Sectors Enabled: <span style={{ color: 'white' }}>{formData.workType}</span></span>
                 <span>Zone: <span style={{ color: 'white' }}>{formData.location}</span></span>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

function AuthRequirementItem({ title, desc, active }) {
  return (
    <div style={{ display: 'flex', gap: '15px', opacity: active ? 1 : 0.3, transition: 'all 0.5s' }}>
      <div style={{ width: '4px', background: active ? 'var(--primary)' : 'var(--border)', borderRadius: '2px', height: 'auto' }}></div>
      <div>
        <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '4px', color: 'white' }}>{title}</h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{desc}</p>
      </div>
    </div>
  );
}

export default AuthPage;
