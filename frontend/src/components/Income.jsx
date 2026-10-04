import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

function Income({ user }) {
  const [incomeList, setIncomeList] = useState([]);
  const [category, setCategory] = useState('Salary');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [editingId, setEditingId] = useState(null);
  const [editCategory, setEditCategory] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [error, setError] = useState('');

  const fetchIncome = async () => {
    try {
      const res = await fetch(`${API_BASE}/income?userId=${user.userId}`);
      const data = await res.json();
      if (data.success) {
        setIncomeList(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch income records');
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!category || !amount) return;

    try {
      const res = await fetch(`${API_BASE}/income`, {
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
        fetchIncome();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error adding income');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/income/${id}`, {
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
        fetchIncome();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income record?')) return;
    try {
      const res = await fetch(`${API_BASE}/income/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchIncome();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-header-flex">
        <div>
          <h2>💵 Income Tracker</h2>
          <p className="card-subtitle">Log incoming funds from salary, freelance, investments, and other sources.</p>
        </div>
      </div>

      {error && <div className="alert-message error"><span>⚠</span><span>{error}</span></div>}

      <form onSubmit={handleAdd} className="form-grid">
        <div className="form-group">
          <label>Source / Category</label>
          <input
            type="text"
            placeholder="e.g. Salary, Consulting, Dividend"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            placeholder="e.g. 50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date Received</label>
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
            placeholder="e.g. Monthly direct deposit"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn success-btn">
          + Add Income
        </button>
      </form>

      <h3>All Income Records ({incomeList.length})</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Source / Category</th>
              <th>Amount (₹)</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incomeList.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-400)' }}>No income recorded yet.</td></tr>
            ) : (
              incomeList.map((inc) => (
                <tr key={inc.id}>
                  <td style={{ color: 'var(--slate-400)', fontWeight: 600 }}>#{inc.id}</td>
                  <td>
                    {editingId === inc.id ? (
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)' }}
                      />
                    ) : (
                      <span className="badge" style={{ background: 'var(--success-subtle)', color: '#065f46' }}>
                        {inc.category}
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--success)', fontWeight: 800 }}>
                    {editingId === inc.id ? (
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)', width: '100px' }}
                      />
                    ) : (
                      `₹${inc.amount.toLocaleString()}`
                    )}
                  </td>
                  <td>
                    {editingId === inc.id ? (
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)' }}
                      />
                    ) : (
                      inc.description || '—'
                    )}
                  </td>
                  <td>{new Date(inc.date).toLocaleDateString()}</td>
                  <td>
                    {editingId === inc.id ? (
                      <>
                        <button className="action-btn edit-btn" onClick={() => handleUpdate(inc.id)}>Save</button>
                        <button className="action-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setEditingId(inc.id);
                            setEditCategory(inc.category);
                            setEditAmount(inc.amount);
                            setEditDesc(inc.description);
                          }}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(inc.id)}
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

export default Income;
