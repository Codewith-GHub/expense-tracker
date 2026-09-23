import { useState, useEffect } from 'react';
import { getCategories, createCategory, deleteCategory } from '../../api/categories';

function CategoryManager({ onChange }) {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
    onChange?.(data);
  };

  useEffect(() => { loadCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;
    try {
      await createCategory({ name: name.trim(), type });
      setName('');
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="category-manager">
      <h3>Categories</h3>
      <form onSubmit={handleAdd} className="category-form">
        <input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">Add</button>
      </form>
      {error && <p className="form-error">{error}</p>}

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id}>
            <span className="category-dot" style={{ background: cat.color }} />
            {cat.name} <em>({cat.type})</em>
            <button onClick={() => handleDelete(cat._id)} className="link-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManager;