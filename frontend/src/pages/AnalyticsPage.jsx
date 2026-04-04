import { BarChart3, TrendingUp, ShieldAlert, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

function AnalyticsPage({ user }) {
  if (!user) return null;
  // Mock data for analytics
  const trends = [
    { month: 'Jan', coverage: 4000, risk: 20 },
    { month: 'Feb', coverage: 4500, risk: 25 },
    { month: 'Mar', coverage: 5000, risk: 45 },
    { month: 'Apr', coverage: 5200, risk: 30 },
  ];

  return (
    <div className="animate-slide-up">
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
        <PieChart size={16} /> Back to Hub
      </Link>
      <div style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: '900', letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>Risk Intelligence</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>AI-driven analysis of your income protection and regional risk factors.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px', marginBottom: '40px' }}>
        {/* Main Chart Card */}
        <div className="glass" style={{ padding: '40px' }}>
          <h3 style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'Outfit', fontSize: '1.4rem' }}>
            <TrendingUp size={24} color="var(--primary)" /> Coverage Thresholds
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '300px', gap: '40px', padding: '0 20px', position: 'relative' }}>
             {trends.map((t, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                   <div style={{ 
                      width: '100%', 
                      height: `${(t.coverage / 6000) * 100}%`, 
                      background: 'linear-gradient(to top, var(--primary), var(--secondary))',
                      borderRadius: '12px 12px 0 0',
                      position: 'relative',
                      boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
                      transition: 'all 0.5s ease'
                   }}>
                      <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', fontWeight: '900', color: 'white' }}>₹{t.coverage}</div>
                   </div>
                   <span style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.05em' }}>{t.month}</span>
                </div>
             ))}
          </div>
        </div>

        {/* Risk Breakdown Card */}
        <div className="glass" style={{ padding: '40px' }}>
           <h3 style={{ marginBottom: '35px', fontSize: '1.4rem', fontFamily: 'Outfit' }}>Risk Attribution</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              <RiskItem label="Meteorological Volatility" value="65%" color="var(--primary)" />
              <RiskItem label="Platform Drift" value="20%" color="var(--secondary)" />
              <RiskItem label="Macro-Risk Factors" value="15%" color="var(--accent)" />
           </div>
        </div>
      </div>

      {/* Insight Section */}
      <div className="glass pulse" style={{ padding: '40px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
         <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'Outfit', fontSize: '1.25rem' }}>
            <ShieldAlert size={26} color="var(--primary)" /> Optimization Insight
         </h3>
         <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.05rem', fontWeight: '500' }}>
            Based on your activity as a <span style={{ color: 'white', fontWeight: '800' }}>{user.workType} Priority</span> worker, increasing your coverage 
            by <span style={{ color: 'var(--accent)', fontWeight: '800' }}>15%</span> during peak risk periods (June-August) could historically reduce income loss by over <span style={{ color: 'var(--accent)', fontWeight: '800' }}>₹2,400</span> per cycle.
         </p>
      </div>
    </div>
  );
}

function RiskItem({ label, value, color }) {
  return (
    <div>
       <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>{label}</span>
          <span style={{ color: 'white', fontWeight: 'bold' }}>{value}</span>
       </div>
       <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: value, height: '100%', background: color }}></div>
       </div>
    </div>
  );
}

export default AnalyticsPage;
