import { deleteTransaction } from '../../api/transactions';

function TransactionList({ transactions, onEdit, onChanged }) {
  const handleDelete = async (id) => {
    await deleteTransaction(id);
    onChanged();
  };

  if (!transactions.length) {
    return <p>No transactions yet — add your first one above.</p>;
  }

  return (
    <table className="transaction-table">
      <thead>
        <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th></th></tr>
      </thead>
      <tbody>
        {transactions.map((tx) => (
          <tr key={tx._id}>
            <td>{new Date(tx.date).toLocaleDateString()}</td>
            <td>{tx.categoryId?.name}</td>
            <td>{tx.description}</td>
            <td className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
              {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
            </td>
            <td>
              <button onClick={() => onEdit(tx)} className="link-button">Edit</button>
              <button onClick={() => handleDelete(tx._id)} className="link-button">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionList;