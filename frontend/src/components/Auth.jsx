import { useState } from 'react';

const API_BASE = 'http://localhost:8000';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    const url = isLogin ? `${API_BASE}/login` : `${API_BASE}/register`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ text: data.message || 'Operation failed', type: 'error' });
        setLoading(false);
        return;
      }

      if (isLogin) {
        onLogin(data.data);
      } else {
        setMessage({ text: 'Sign up successful! Please log in.', type: 'success' });
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Cannot connect to backend server. Make sure backend is running.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Hero Panel */}
      <div className="auth-hero-side">
        <div className="auth-brand">
          <div className="auth-brand-logo">✦</div>
          <h2>ExpenseFlow</h2>
        </div>

        <div className="auth-hero-content">
          <h1>
            Take control of your <span>financial future</span> today.
          </h1>
          <p>
            Track daily expenses, record multiple income streams, set smart monthly budgets,
            and view real-time analytics designed for smart consumers.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <span>Real-time budget vs actual spending analytics</span>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <span>Categorized transaction logs with instant editing</span>
            </div>
            <div className="feature-item">
              <div className="feature-check">✓</div>
              <span>Clean, high-performance MERN architecture</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: '#94a3b8', position: 'relative', zIndex: 10 }}>
          © 2026 ExpenseFlow. Designed for Consumer Financial Management.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-side">
        <div className="auth-box">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back 👋' : 'Create an Account 🚀'}</h2>
            <p>
              {isLogin
                ? 'Enter your credentials to access your personal dashboard.'
                : 'Start tracking your personal expenses and budgets in seconds.'}
            </p>
          </div>

          {message.text && (
            <div className={`alert-message ${message.type}`}>
              <span>{message.type === 'success' ? '✓' : '⚠'}</span>
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="auth-username">Username</label>
              <input
                id="auth-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : isLogin ? 'Sign In to Dashboard' : 'Create Account'}
            </button>
          </form>

          <div className="auth-toggle-box">
            <span>{isLogin ? "Don't have an account yet?" : 'Already registered?'}</span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage({ text: '', type: '' });
              }}
            >
              {isLogin ? 'Sign Up here' : 'Sign In here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
