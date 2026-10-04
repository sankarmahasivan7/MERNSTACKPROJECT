import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

function Budgets({ user }) {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [amount, setAmount] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editMonth, setEditMonth] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [error, setError] = useState('');

  const fetchBudgets = async () => {
    try {
      const res = await fetch(`${API_BASE}/budgets?userId=${user.userId}`);
      const data = await res.json();
      if (data.success) {
        setBudgets(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch budgets');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories?userId=${user.userId}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
        if (data.data.length > 0 && !category) {
          setCategory(data.data[0].categoryName);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!category || !month || !amount) return;

    try {
      const res = await fetch(`${API_BASE}/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          month,
          amount: Number(amount),
          userId: user.userId
        })
      });
      const data = await res.json();
      if (data.success) {
        setAmount('');
        fetchBudgets();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error adding budget');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: editCategory,
          month: editMonth,
          amount: Number(editAmount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      const res = await fetch(`${API_BASE}/budgets/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-header-flex">
        <div>
          <h2>🎯 Budgets Management</h2>
          <p className="card-subtitle">Set monthly expenditure thresholds per category to stay within your means.</p>
        </div>
      </div>

      {error && <div className="alert-message error"><span>⚠</span><span>{error}</span></div>}

      <form onSubmit={handleAdd} className="form-grid">
        <div className="form-group">
          <label>Category</label>
          {categories.length > 0 ? (
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c.categoryId} value={c.categoryName}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="e.g. Groceries"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          )}
        </div>

        <div className="form-group">
          <label>Target Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Budget Limit (₹)</label>
          <input
            type="number"
            placeholder="e.g. 10000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn purple-btn">
          + Set Budget
        </button>
      </form>

      <h3>Configured Budgets ({budgets.length})</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Target Month</th>
              <th>Budget Limit (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-400)' }}>No budget allocations created yet.</td></tr>
            ) : (
              budgets.map((b) => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--slate-400)', fontWeight: 600 }}>#{b.id}</td>
                  <td>
                    {editingId === b.id ? (
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)' }}
                      />
                    ) : (
                      <span className="badge" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}>
                        {b.category}
                      </span>
                    )}
                  </td>
                  <td>
                    {editingId === b.id ? (
                      <input
                        type="month"
                        value={editMonth}
                        onChange={(e) => setEditMonth(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)' }}
                      />
                    ) : (
                      b.month
                    )}
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--slate-900)' }}>
                    {editingId === b.id ? (
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)', width: '100px' }}
                      />
                    ) : (
                      `₹${b.amount.toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {editingId === b.id ? (
                      <>
                        <button className="action-btn edit-btn" onClick={() => handleUpdate(b.id)}>Save</button>
                        <button className="action-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setEditingId(b.id);
                            setEditCategory(b.category);
                            setEditMonth(b.month);
                            setEditAmount(b.amount);
                          }}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(b.id)}
                        >
                          ✕ Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Budgets;
