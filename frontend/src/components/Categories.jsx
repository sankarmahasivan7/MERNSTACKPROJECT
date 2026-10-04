import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:8000';

function Categories({ user }) {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories?userId=${user.userId}`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!categoryName) return;

    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName, userId: user.userId })
      });
      const data = await res.json();
      if (data.success) {
        setCategoryName('');
        fetchCategories();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
      setError('Error adding category');
    }
  };

  const handleUpdate = async (categoryId) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: editName })
      });
      const data = await res.json();
      if (data.success) {
        setEditingId(null);
        setEditName('');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card">
      <div className="card-header-flex">
        <div>
          <h2>🏷️ Categories Management</h2>
          <p className="card-subtitle">Create and customize spending and income labels for your account.</p>
        </div>
      </div>

      {error && <div className="alert-message error"><span>⚠</span><span>{error}</span></div>}

      <form onSubmit={handleAdd} className="form-grid">
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label>New Category Name</label>
          <input
            type="text"
            placeholder="e.g. Groceries, Rent, Utilities, Entertainment"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">+ Add Category</button>
      </form>

      <h3>Defined Categories ({categories.length})</h3>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Category ID</th>
              <th>Category Name</th>
              <th style={{ width: '200px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-400)' }}>No categories defined yet.</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.categoryId}>
                  <td style={{ color: 'var(--slate-400)', fontWeight: 600 }}>#{cat.categoryId}</td>
                  <td>
                    {editingId === cat.categoryId ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--slate-300)' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{cat.categoryName}</span>
                    )}
                  </td>
                  <td>
                    {editingId === cat.categoryId ? (
                      <>
                        <button className="action-btn edit-btn" onClick={() => handleUpdate(cat.categoryId)}>Save</button>
                        <button className="action-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setEditingId(cat.categoryId);
                            setEditName(cat.categoryName);
                          }}
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(cat.categoryId)}
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

export default Categories;
