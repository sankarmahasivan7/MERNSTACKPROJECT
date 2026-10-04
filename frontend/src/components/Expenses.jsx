import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

function Expenses({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [error, setError] = useState('');

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_BASE}/expenses?userId=${user.userId}`);
      const data = await res.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch expenses');
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
    fetchExpenses();
    fetchCategories();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;

    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          amount: Number(amount),
          description,
          date,
          userId: user.userId
        })
      });
      const data = await res.json();
      if (data.success) {
        setAmount('');
        setDescription('');
        fetchExpenses();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error adding expense');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: editCategory,
          amount: Number(editAmount),
          description: editDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchExpenses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-header-flex">
        <div>
          <h2>💸 Expenses Tracker</h2>
          <p className="card-subtitle">Log, categorize, and control your day-to-day spending.</p>
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
              placeholder="e.g. Food, Transport"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          )}
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            placeholder="e.g. 750"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description / Notes</label>
          <input
            type="text"
            placeholder="e.g. Dinner with team"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn" style={{ background: 'var(--danger-gradient)' }}>
          + Add Expense
        </button>
      </form>

      <h3>All Recorded Expenses ({expenses.length})</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Amount (₹)</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-400)' }}>No expenses recorded yet.</td></tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id}>
                  <td style={{ color: 'var(--slate-400)', fontWeight: 600 }}>#{exp.id}</td>
                  <td>
                    {editingId === exp.id ? (
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)' }}
                      />
                    ) : (
                      <span className="badge" style={{ background: 'var(--slate-100)', color: 'var(--slate-700)' }}>
                        {exp.category}
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--danger)', fontWeight: 800 }}>
                    {editingId === exp.id ? (
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)', width: '100px' }}
                      />
                    ) : (
                      `₹${exp.amount.toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {editingId === exp.id ? (
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)' }}
                      />
                    ) : (
                      exp.description || '—'
                    )}
                  </td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td>
                    {editingId === exp.id ? (
                      <>
                        <button className="action-btn edit-btn" onClick={() => handleUpdate(exp.id)}>Save</button>
                        <button className="action-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setEditingId(exp.id);
                            setEditCategory(exp.category);
                            setEditAmount(exp.amount);
                            setEditDesc(exp.description);
                          }}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(exp.id)}
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

export default Expenses;
