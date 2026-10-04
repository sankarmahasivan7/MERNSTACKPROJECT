import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

function Reports({ user }) {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netBalance: 0, categoryWiseExpense: {} });
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [comparison, setComparison] = useState([]);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/reports/summary?userId=${user.userId}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch summary report');
    }
  };

  const fetchComparison = async (targetMonth) => {
    try {
      const res = await fetch(`${API_BASE}/reports/budget-comparison?month=${targetMonth}&userId=${user.userId}`);
      const data = await res.json();
      if (data.success) {
        setComparison(data.data.comparison);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSummary();
    fetchComparison(month);
  }, [user, month]);

  return (
    <div>
      {error && <div className="alert-message error"><span>⚠</span><span>{error}</span></div>}

      {/* Top 3 Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card income">
          <div className="summary-content">
            <h4>Total Income</h4>
            <p className="amount">₹{summary.totalIncome.toLocaleString()}</p>
            <div className="subtext">All verified earnings</div>
          </div>
          <div className="summary-icon-wrap">💵</div>
        </div>

        <div className="summary-card expense">
          <div className="summary-content">
            <h4>Total Expenses</h4>
            <p className="amount">₹{summary.totalExpense.toLocaleString()}</p>
            <div className="subtext">Cumulative recorded spending</div>
          </div>
          <div className="summary-icon-wrap">💸</div>
        </div>

        <div className="summary-card balance">
          <div className="summary-content">
            <h4>Net Balance / Savings</h4>
            <p className="amount">₹{summary.netBalance.toLocaleString()}</p>
            <div className="subtext">{summary.netBalance >= 0 ? '✓ Healthy positive balance' : '⚠ Deficit detected'}</div>
          </div>
          <div className="summary-icon-wrap">🏦</div>
        </div>
      </div>

      {/* Monthly Budget vs Actual Expenses */}
      <div className="card">
        <div className="card-header-flex">
          <div>
            <h2>🎯 Budget vs Actual Spending</h2>
            <p className="card-subtitle">Track adherence to spending targets for the selected month.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--slate-600)' }}>Filter Month:</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--slate-300)',
                fontFamily: 'inherit',
                fontSize: '13px'
              }}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget Limit</th>
                <th>Actual Spent</th>
                <th>Remaining</th>
                <th style={{ minWidth: '160px' }}>Budget Usage</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {comparison.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>
                    No budget allocations found for {month}. Head over to the <strong>Budgets</strong> tab to set one!
                  </td>
                </tr>
              ) : (
                comparison.map((c, index) => {
                  const percentage = Math.min(100, Math.round((c.spentAmount / (c.budgetAmount || 1)) * 100));
                  return (
                    <tr key={index}>
                      <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{c.category}</td>
                      <td>₹{c.budgetAmount.toLocaleString()}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 600 }}>₹{c.spentAmount.toLocaleString()}</td>
                      <td style={{ color: c.remainingAmount < 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
                        ₹{c.remainingAmount.toLocaleString()}
                      </td>
                      <td>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--slate-500)', marginBottom: '4px' }}>
                          {percentage}% utilized
                        </div>
                        <div className="progress-container">
                          <div
                            className={`progress-bar ${c.isOverBudget ? 'danger' : 'safe'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>
                      <td>
                        {c.isOverBudget ? (
                          <span className="badge danger">Over Budget</span>
                        ) : (
                          <span className="badge safe">Within Budget</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category-wise Expenses Breakdown */}
      <div className="card">
        <h2>🏷️ Category-wise Spending Breakdown</h2>
        <p className="card-subtitle" style={{ marginBottom: '16px' }}>Aggregate spending distribution across categories.</p>
        
        {Object.keys(summary.categoryWiseExpense).length === 0 ? (
          <p style={{ color: 'var(--slate-400)', padding: '16px 0' }}>No categorized spending recorded yet.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total Spent (₹)</th>
                  <th>Share of Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(summary.categoryWiseExpense).map(([cat, amt]) => {
                  const total = summary.totalExpense || 1;
                  const share = Math.round((amt / total) * 100);
                  return (
                    <tr key={cat}>
                      <td style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{cat}</td>
                      <td style={{ fontWeight: 800, color: 'var(--slate-900)' }}>₹{amt.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, width: '35px' }}>{share}%</span>
                          <div className="progress-container" style={{ flex: 1, margin: 0 }}>
                            <div className="progress-bar safe" style={{ width: `${share}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
