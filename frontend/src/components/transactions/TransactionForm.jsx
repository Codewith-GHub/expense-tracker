import { useState, useEffect } from 'react';
import { createTransaction, updateTransaction } from '../../api/transactions';

function TransactionForm({ categories, editingTransaction, onSaved, onCancelEdit }) {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setCategoryId(editingTransaction.categoryId?._id || editingTransaction.categoryId);
      setAmount(editingTransaction.amount);
      setDescription(editingTransaction.description || '');
      setDate(editingTransaction.date?.slice(0, 10));
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setCategoryId('');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!categoryId) {
      setError('Pick a category');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { categoryId, amount: Number(amount), description, date };
      if (editingTransaction) {
        await updateTransaction(editingTransaction._id, payload);
      } else {
        await createTransaction(payload);
      }
      resetForm();
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</h3>

      <label>
        Category
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name} ({cat.type})</option>
          ))}
        </select>
      </label>

      <label>
        Amount
        <input type="number" step="0.01" min="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </label>

      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <label>
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>

      {error && <p className="form-error">{error}</p>}

      <div className="transaction-form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : editingTransaction ? 'Update' : 'Add'}
        </button>
        {editingTransaction && (
          <button type="button" onClick={onCancelEdit} className="secondary-button">Cancel</button>
        )}
      </div>
    </form>
  );
}

export default TransactionForm;