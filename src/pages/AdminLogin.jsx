import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLogin({ setAuth }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Talking to your actual Node.js backend!
      const response = await fetch('https://azim-portfolio-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token); // Store the VIP wristband
        setAuth(true); // This tells App.jsx to unlock the dashboard!
      } else {
        setError(data.message || 'Access Denied');
      }
    } catch (err) {
      setError('Server connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090e17', color: 'white' }}>
      
      {/* Premium Glassmorphism Card */}
      <div style={{ backgroundColor: 'rgba(16, 23, 42, 0.7)', border: '1px solid rgba(255,255,255,0.05)', padding: '50px', borderRadius: '24px', backdropFilter: 'blur(16px)', width: '100%', maxWidth: '420px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        
        {/* Animated Icon Header */}
        <div style={{ backgroundColor: 'rgba(45, 212, 191, 0.1)', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(45, 212, 191, 0.3)' }}>
          <Lock size={32} color="#2dd4bf" />
        </div>
        
        <h2 style={{ fontFamily: '"Space Grotesk", sans-serif', fontSize: '1.8rem', marginBottom: '8px', color: '#f1f5f9' }}>Workspace Access</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '32px' }}>Verify your identity to enter the admin zone.</p>

        {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <input 
            type="password" 
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '4px', outline: 'none' }}
            required 
          />

          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#2dd4bf', color: '#090e17', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: '0.3s' }}
          >
            {loading ? 'Verifying...' : 'Unlock Workspace'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <a href="/" style={{ display: 'block', marginTop: '30px', color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>&larr; Back to Public Portfolio</a>
      </div>
      
    </div>
  );
}