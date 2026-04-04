import React from 'react';
import { User, Mail, Shield, Bell, MapPin, Briefcase, CreditCard } from 'lucide-react';

function ProfilePage({ user }) {
  return (
    <div className="animate-slide-up">
      <div style={{ marginBottom: '50px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px', fontWeight: '900', letterSpacing: '-0.04em', fontFamily: 'Outfit' }}>Identity Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '500' }}>Manage your personal identity, risk factors, and bank details for automated payouts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px', marginBottom: '40px' }}>
        {/* User Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div className="glass pulse" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 25px auto', 
              border: '2px solid var(--primary)',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)'
            }}>
              <User size={56} color="var(--primary)" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', fontFamily: 'Outfit' }}>{user.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600', marginTop: '5px' }}>Verified Worker Identity</p>
            <div style={{ marginTop: '20px' }}>
               <span className="badge badge-success" style={{ padding: '8px 16px' }}>Protocol Access: active</span>
            </div>
          </div>

          <div className="glass" style={{ padding: '30px' }}>
             <h3 style={{ marginBottom: '25px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'Outfit' }}>
                <Bell size={20} color="var(--accent)" /> Neural Alerts
             </h3>
             <NotificationToggle label="Payout Triggers" active={true} />
             <NotificationToggle label="Environment Risks" active={true} />
             <NotificationToggle label="System Integrity" active={false} />
          </div>
        </div>

        {/* Details Card */}
        <div className="glass" style={{ padding: '50px' }}>
           <h3 style={{ marginBottom: '40px', fontSize: '1.5rem', fontFamily: 'Outfit', borderBottom: '1px solid var(--border)', paddingBottom: '20px', fontWeight: '800' }}>Identity Protocol Details</h3>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <DetailField label="Base Risk Location" value={user.location} icon={<MapPin size={20} color="var(--primary)" />} />
              <DetailField label="Operational Sector" value={user.workType} icon={<Briefcase size={20} color="var(--primary)" />} />
              <DetailField label="Coverage Tier" value="Elite Protection" icon={<Shield size={20} color="var(--secondary)" />} />
              <DetailField label="Verification Status" value="ZKP-Certified" icon={<Shield size={20} color="var(--accent)" />} />
           </div>

           <h3 style={{ margin: '50px 0 30px 0', fontSize: '1.5rem', fontFamily: 'Outfit', borderBottom: '1px solid var(--border)', paddingBottom: '20px', fontWeight: '800' }}>Disbursement Node</h3>
           <div style={{ padding: '30px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '25px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '16px', borderRadius: '16px', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}>
                 <CreditCard size={28} color="white" />
              </div>
              <div>
                 <p style={{ fontWeight: '900', fontSize: '1.1rem', color: 'white' }}>Federal Node - **** 9284</p>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Instant parametric settlement active</p>
              </div>
              <button className="premium-btn" style={{ marginLeft: 'auto', padding: '10px 25px', fontSize: '0.8rem' }}>Update Link</button>
           </div>
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
       <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {icon} {label}
       </span>
       <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{value}</span>
    </div>
  );
}

function NotificationToggle({ label, active }) {
   return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
         <span style={{ fontSize: '0.9rem' }}>{label}</span>
         <div style={{ width: '40px', height: '20px', background: active ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
            <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: active ? '22px' : '2px', transition: 'all 0.3s' }}></div>
         </div>
      </div>
   );
}

export default ProfilePage;
