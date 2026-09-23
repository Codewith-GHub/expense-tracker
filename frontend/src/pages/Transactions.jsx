import { useState, useEffect, useCallback } from 'react';
import CategoryManager from '../components/transactions/CategoryManager';
import TransactionForm from '../components/transactions/TransactionForm';
import TransactionList from '../components/transactions/TransactionList';
import { getTransactions } from '../api/transactions';

function Transactions() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const loadTransactions = useCallback(async () => {
    const res = await getTransactions({ page: 1, limit: 50 });
    setTransactions(res.data);
  }, []);

  useEffect(() => { loadTransactions(); }, [loadTransactions]);

  return (
    <div className="page">
      <h1>Transactions</h1>

      <CategoryManager onChange={setCategories} />

      <TransactionForm
        categories={categories}
        editingTransaction={editingTransaction}
        onSaved={() => { setEditingTransaction(null); loadTransactions(); }}
        onCancelEdit={() => setEditingTransaction(null)}
      />

      <TransactionList
        transactions={transactions}
        onEdit={setEditingTransaction}
        onChanged={loadTransactions}
      />
    </div>
  );
}

export default Transactions;