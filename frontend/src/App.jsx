import { useState, useEffect } from 'react';
import './App.css';
import Auth from './components/Auth';
import Reports from './components/Reports';
import Expenses from './components/Expenses';
import Income from './components/Income';
import Categories from './components/Categories';
import Budgets from './components/Budgets';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('reports');

  // Check saved user session
  useEffect(() => {
    const savedUser = localStorage.getItem('expense_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('expense_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('expense_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('expense_user');
    setActiveTab('reports');
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  // Current formatted date
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tabTitles = {
    reports: { title: 'Dashboard & Reports', desc: 'Real-time overview of your income, expenses, and budget status.' },
    expenses: { title: 'Expenses Tracker', desc: 'Log, monitor, and manage your daily spending.' },
    income: { title: 'Income Tracker', desc: 'Track your earnings from salaries, freelancing, and investments.' },
    categories: { title: 'Category Management', desc: 'Organize your transactions with custom categories.' },
    budgets: { title: 'Monthly Budgets', desc: 'Set and track spending limits across all categories.' }
  };

  return (
    <div className="dashboard-layout">
      {/* Modern Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-icon">✦</div>
          <div className="brand-text">
            <h2>ExpenseFlow</h2>
            <span>Consumer Portal</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <span className="icon">📊</span>
            <span>Dashboard & Reports</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <span className="icon">💸</span>
            <span>Expenses</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'income' ? 'active' : ''}`}
            onClick={() => setActiveTab('income')}
          >
            <span className="icon">💵</span>
            <span>Income</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <span className="icon">🏷️</span>
            <span>Categories</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'budgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('budgets')}
          >
            <span className="icon">🎯</span>
            <span>Budgets</span>
          </button>
        </nav>

        {/* User Card at Bottom of Sidebar */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">
              {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user.username}</div>
              <div className="user-role">Consumer ID: #{user.userId}</div>
            </div>
            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              ⎋
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        <header className="topbar">
          <div className="topbar-left">
            <h1>{tabTitles[activeTab]?.title || 'Dashboard'}</h1>
            <p>{tabTitles[activeTab]?.desc || ''}</p>
          </div>

          <div className="topbar-right">
            <div className="date-badge">
              <span>📅</span>
              <span>{today}</span>
            </div>
          </div>
        </header>

        <main className="content-container">
          {activeTab === 'reports' && <Reports user={user} />}
          {activeTab === 'expenses' && <Expenses user={user} />}
          {activeTab === 'income' && <Income user={user} />}
          {activeTab === 'categories' && <Categories user={user} />}
          {activeTab === 'budgets' && <Budgets user={user} />}
        </main>
      </div>
    </div>
  );
}

export default App;
