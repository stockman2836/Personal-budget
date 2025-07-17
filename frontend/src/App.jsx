import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = 'http://127.0.0.1:8000'; // adjust if backend runs elsewhere

export default function App() {
  const [operations, setOperations] = useState([]);
  const [balance, setBalance] = useState(0);

  // form state
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  // filters
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchOperations();
    fetchBalance();
  }, []);

  const fetchOperations = async () => {
    try {
      const res = await axios.get(`${API_URL}/operations`);
      setOperations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await axios.get(`${API_URL}/balance`);
      setBalance(res.data.balance);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!amount || !category || !date) {
      alert('Заполните все поля');
      return;
    }
    try {
      await axios.post(`${API_URL}/operations`, {
        type,
        amount: parseFloat(amount),
        category,
        date,
      });
      setType('income');
      setAmount('');
      setCategory('');
      setDate('');
      await fetchOperations();
      await fetchBalance();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить операцию?')) return;
    try {
      await axios.delete(`${API_URL}/operations/${id}`);
      await fetchOperations();
      await fetchBalance();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOps = operations.filter((op) => {
    const typeMatch = filterType === 'all' || op.type === filterType;
    const catMatch = filterCategory === 'all' || op.category === filterCategory;
    return typeMatch && catMatch;
  });

  // categories list for filter
  const categories = Array.from(new Set(operations.map((op) => op.category)));

  // Chart data
  const expenseDataMap = {};
  operations
    .filter((op) => op.type === 'expense')
    .forEach((op) => {
      expenseDataMap[op.category] = (expenseDataMap[op.category] || 0) + op.amount;
    });
  const chartData = {
    labels: Object.keys(expenseDataMap),
    datasets: [
      {
        data: Object.values(expenseDataMap),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-5">Personal Budget</h1>

      {/* Add operation */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Add Transaction</h2>
          <form onSubmit={handleAdd} className="row g-3">
            <div className="col-sm-3">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="col-sm-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="col-sm-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="col-sm-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary px-5">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Filters</h2>
          <div className="row g-3 align-items-end">
            <div className="col-sm-6">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="col-sm-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Operations list */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Transactions</h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOps.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No transactions
                    </td>
                  </tr>
                ) : (
                  filteredOps.map((op) => (
                    <tr key={op.id}>
                      <td>{op.date}</td>
                      <td>{op.type === 'income' ? 'Income' : 'Expense'}</td>
                      <td>{op.category}</td>
                      <td>${op.amount.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(op.id)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="card mb-4 shadow text-center">
        <div className="card-body">
          <h2 className="card-title">Balance</h2>
          <p className="display-6 fw-bold mb-0">${balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="card mb-4 shadow">
        <div className="card-body chart-wrapper">
          <h2 className="card-title mb-4 text-center">Expense Chart by Category</h2>
          {Object.keys(expenseDataMap).length === 0 ? (
            <p className="text-center">No data for chart</p>
          ) : (
            <Pie data={chartData} />
          )}
        </div>
      </div>
    </div>
  );
} 