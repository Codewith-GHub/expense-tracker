import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSummary } from '../api/transactions';

function Dashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => { getSummary().then(setSummary); }, []);

  if (!summary) return <div className="page">Loading...</div>;

  const expenseCategories = summary.byCategory.filter((c) => c.type === 'expense');

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="summary-cards">
        <div className="summary-card income"><span>Income</span><strong>${summary.income.toFixed(2)}</strong></div>
        <div className="summary-card expense"><span>Expense</span><strong>${summary.expense.toFixed(2)}</strong></div>
        <div className="summary-card balance"><span>Balance</span><strong>${summary.balance.toFixed(2)}</strong></div>
      </div>

      {expenseCategories.length > 0 && (
        <div className="chart-wrapper">
          <h3>Spend by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={expenseCategories} dataKey="total" nameKey="name" outerRadius={100} label>
                {expenseCategories.map((entry) => (
                  <Cell key={entry.categoryId} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Dashboard;