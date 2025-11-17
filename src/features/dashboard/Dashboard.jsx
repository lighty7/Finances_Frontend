import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/routes';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { formatCurrency } from '../../shared/utils/constants';
import Button from '../../shared/components/Button';
import ToastService from '../../shared/components/Toast';
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  fetchLoanSummary,
} from './services/dashboard';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const monthOptions = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const defaultTransactionForm = () => ({
  type: 'INCOME',
  amount: '',
  category: '',
  description: '',
  transactionDate: new Date().toISOString().split('T')[0],
  loanReference: '',
  paidEmi: false,
});

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  usePageTitle();

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [viewMode, setViewMode] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [transactions, setTransactions] = useState([]);
  const [transactionSummary, setTransactionSummary] = useState({
    incomeTotal: 0,
    expenseTotal: 0,
    emiPaid: false,
    paidEmiTransactionId: null,
  });
  const [loanSummary, setLoanSummary] = useState(null);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [loanLoading, setLoanLoading] = useState(false);
  const [transactionForm, setTransactionForm] = useState(() => defaultTransactionForm());
  const [savingTransaction, setSavingTransaction] = useState(false);

  const yearOptions = useMemo(() => {
    const startYear = currentYear - 2;
    return Array.from({ length: 5 }, (_, index) => startYear + index);
  }, [currentYear]);

  const summaryTotals = useMemo(() => {
    const income = transactionSummary.incomeTotal || 0;
    const expenses = transactionSummary.expenseTotal || 0;
    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [transactionSummary]);

  const loanReportData = useMemo(() => {
    if (!loanSummary?.loans?.length) {
      return [];
    }

    return loanSummary.loans.map((loan, index) => ({
      name: loan.bankName || loan.loanType || `Loan ${index + 1}`,
      balance: Number(loan.balance || 0),
      monthsToPayoff: loan.monthsToPayoff || 0,
      payoffDate: loan.payoffDate,
    }));
  }, [loanSummary]);

  const isCurrentPeriod =
    viewMode === 'monthly' &&
    Number(selectedMonth) === currentMonth &&
    Number(selectedYear) === currentYear;

  const handleLogout = async () => {
    try {
      await logout();
      ToastService.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (_error) {
      ToastService.error('Failed to logout. Please try again.');
    }
  };

  const handleOpenSettings = () => {
    navigate(ROUTES.CONFIGURATION);
  };

  const loadTransactions = useCallback(async () => {
    try {
      setTransactionsLoading(true);
      const params =
        viewMode === 'yearly'
          ? { year: selectedYear }
          : { month: selectedMonth, year: selectedYear };

      const data = await fetchTransactions(params);
      setTransactions(data.transactions || []);
      setTransactionSummary(
        data.summary || {
          incomeTotal: 0,
          expenseTotal: 0,
          emiPaid: false,
          paidEmiTransactionId: null,
        }
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to load transactions';
      ToastService.error(message);
    } finally {
      setTransactionsLoading(false);
    }
  }, [selectedMonth, selectedYear, viewMode]);

  const loadLoanSummary = useCallback(async () => {
    try {
      setLoanLoading(true);
      const data = await fetchLoanSummary();
      setLoanSummary(data);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to load loan summary';
      ToastService.error(message);
    } finally {
      setLoanLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLoanSummary();
  }, [loadLoanSummary]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleTransactionFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTransactionForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetForm = () => {
    setTransactionForm(defaultTransactionForm());
  };

  const handleAddTransaction = async (event) => {
    event.preventDefault();
    try {
      setSavingTransaction(true);
      const payload = {
        type: transactionForm.type,
        amount: transactionForm.amount ? parseFloat(transactionForm.amount) : 0,
        category: transactionForm.category || undefined,
        description: transactionForm.description || undefined,
        transactionDate: transactionForm.transactionDate,
        loanReference: transactionForm.loanReference || undefined,
        paidEmi: transactionForm.paidEmi,
      };

      await createTransaction(payload);
      ToastService.success('Transaction added');
      resetForm();
      await loadTransactions();
      await loadLoanSummary();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to add transaction';
      ToastService.error(message);
    } finally {
      setSavingTransaction(false);
    }
  };

  const handleMarkEmiPaid = async () => {
    if (!isCurrentPeriod) {
      ToastService.error('You can only mark the current month EMI as paid.');
      return;
    }

    try {
      setSavingTransaction(true);
      if (transactionSummary.paidEmiTransactionId) {
        await updateTransaction(transactionSummary.paidEmiTransactionId, {
          paidEmi: true,
        });
      } else {
        const periodLabel = `${monthOptions.find(
          (m) => m.value === Number(selectedMonth)
        )?.label || 'Month'} ${selectedYear}`;

        await createTransaction({
          type: 'EXPENSE',
          amount: loanSummary?.totalEmi || 0,
          category: 'EMI Payment',
          description: `EMI payment for ${periodLabel}`,
          transactionDate: new Date().toISOString().split('T')[0],
          paidEmi: true,
        });
      }
      ToastService.success('Marked current EMI as paid');
      await loadTransactions();
      await loadLoanSummary();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Unable to update EMI status';
      ToastService.error(message);
    } finally {
      setSavingTransaction(false);
    }
  };

  const transactionsEmpty = !transactionsLoading && transactions.length === 0;

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-gradient-to-r from-primary via-primary to-secondary text-white py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Budget Tracker
          </h1>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="font-semibold text-base">{user?.userName || 'User'}</span>
              <span className="text-sm opacity-90">{user?.emailId}</span>
            </div>
            <Button
              variant="secondary"
              size="small"
              onClick={handleLogout}
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/50"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-8">
          <section className="bg-slate-800 p-8 rounded-xl shadow-md border border-slate-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-100">
                  Welcome back, {user?.userName || 'User'}!
                </h2>
                <p className="text-slate-300 text-base">
                  Track your monthly progress, transactions, and loan payoffs from one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2 rounded-lg"
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                >
                  <option value="monthly">Monthly view</option>
                  <option value="yearly">Full year view</option>
                </select>
                <select
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2 rounded-lg"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {viewMode === 'monthly' && (
                  <select
                    className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2 rounded-lg"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {monthOptions.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Total Balance</p>
              <p className="text-3xl font-bold text-slate-100 mt-2">
                {formatCurrency(summaryTotals.balance)}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Income - Expenses ({viewMode === 'monthly' ? 'This month' : 'Year to date'})
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Income</p>
              <p className="text-3xl font-bold text-emerald-400 mt-2">
                {formatCurrency(summaryTotals.income)}
              </p>
              <p className="text-slate-500 text-sm mt-1">Recorded inflows</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Expenses</p>
              <p className="text-3xl font-bold text-rose-400 mt-2">
                {formatCurrency(summaryTotals.expenses)}
              </p>
              <p className="text-slate-500 text-sm mt-1">Recorded outflows</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl shadow-md border border-slate-700">
              <p className="text-slate-400 text-xs uppercase tracking-wider">Outstanding Loans</p>
              <p className="text-3xl font-bold text-slate-100 mt-2">
                {formatCurrency(loanSummary?.totalLoanBalance || 0)}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                Across {loanSummary?.loans?.length || 0} accounts
              </p>
            </div>
          </div>

          <section className="bg-slate-800 p-8 rounded-xl shadow-md border border-slate-700">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Transactions</h2>
                  <p className="text-slate-400 text-sm">
                    Add income, expenses, or EMI payments for any date. Switch between month or full-year view to review history.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      transactionSummary.emiPaid ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    EMI {transactionSummary.emiPaid ? 'Paid' : 'Pending'}
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    disabled={savingTransaction || !loanSummary || !isCurrentPeriod}
                    onClick={handleMarkEmiPaid}
                  >
                    {transactionSummary.emiPaid ? 'Update EMI' : 'Mark EMI Paid'}
                  </Button>
                </div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleAddTransaction}>
                <select
                  name="type"
                  value={transactionForm.type}
                  onChange={handleTransactionFormChange}
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg"
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={handleTransactionFormChange}
                  placeholder="Amount"
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="category"
                  value={transactionForm.category}
                  onChange={handleTransactionFormChange}
                  placeholder="Category (optional)"
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg"
                />
                <input
                  type="date"
                  name="transactionDate"
                  value={transactionForm.transactionDate}
                  onChange={handleTransactionFormChange}
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="loanReference"
                  value={transactionForm.loanReference}
                  onChange={handleTransactionFormChange}
                  placeholder="Loan reference (optional)"
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg md:col-span-2"
                />
                <input
                  type="text"
                  name="description"
                  value={transactionForm.description}
                  onChange={handleTransactionFormChange}
                  placeholder="Description"
                  className="bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg md:col-span-2"
                />
                <label className="flex items-center gap-3 text-slate-200 text-sm">
                  <input
                    type="checkbox"
                    name="paidEmi"
                    checked={transactionForm.paidEmi}
                    onChange={handleTransactionFormChange}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                  />
                  This transaction covers this month&apos;s EMI
                </label>
                <Button type="submit" disabled={savingTransaction}>
                  {savingTransaction ? 'Saving...' : 'Add Transaction'}
                </Button>
              </form>

              <div className="overflow-x-auto border border-slate-700 rounded-xl">
                <table className="w-full text-left text-slate-200">
                  <thead className="bg-slate-900 text-slate-400 text-sm uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Category / Loan</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-center">EMI Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionsLoading && (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-slate-400">
                          Loading transactions...
                        </td>
                      </tr>
                    )}
                    {transactionsEmpty && (
                      <tr>
                        <td colSpan="6" className="px-4 py-6 text-center text-slate-400">
                          No transactions recorded for this period yet.
                        </td>
                      </tr>
                    )}
                    {!transactionsLoading &&
                      transactions.map((txn) => (
                        <tr key={txn.id} className="border-t border-slate-700/50">
                          <td className="px-4 py-3">{new Date(txn.transactionDate).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                txn.type === 'INCOME'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {txn.type}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col">
                              <span>{txn.category || '—'}</span>
                              {txn.loanReference && (
                                <span className="text-slate-500 text-xs">{txn.loanReference}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-300">{txn.description || '—'}</td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {formatCurrency(txn.amount)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {txn.paidEmi ? (
                              <span className="text-emerald-400 text-sm font-medium">Yes</span>
                            ) : (
                              <span className="text-slate-500 text-sm">No</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="bg-slate-800 p-8 rounded-xl shadow-md border border-slate-700">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Loan Overview</h2>
                  <p className="text-slate-400 text-sm">
                    Snapshot of outstanding balances, interest rates, and projected payoff dates based on current EMI allocations.
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg text-sm ${
                    loanLoading ? 'bg-slate-700 text-slate-300' : 'bg-slate-900 text-slate-200'
                  }`}
                >
                  {loanLoading ? 'Refreshing...' : `${loanSummary?.loans?.length || 0} loans`}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-700 rounded-xl">
                <table className="w-full text-left text-slate-200">
                  <thead className="bg-slate-900 text-slate-400 text-sm uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-3">Lender / Type</th>
                      <th className="px-4 py-3 text-right">Balance</th>
                      <th className="px-4 py-3 text-right">Interest (%)</th>
                      <th className="px-4 py-3 text-right">Monthly Allocation</th>
                      <th className="px-4 py-3">Projected Payoff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loanSummary?.loans?.length && (
                      <tr>
                        <td colSpan="5" className="px-4 py-6 text-center text-slate-400">
                          No loans configured yet. Update your configuration to see details here.
                        </td>
                      </tr>
                    )}
                    {loanSummary?.loans?.map((loan) => (
                      <tr key={loan.id} className="border-t border-slate-700/50">
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="font-semibold">{loan.bankName || '—'}</span>
                            <span className="text-slate-500 text-xs">{loan.loanType || 'Loan'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatCurrency(loan.balance)}
                        </td>
                        <td className="px-4 py-3 text-right">{loan.interestRate || 0}%</td>
                        <td className="px-4 py-3 text-right">
                          {formatCurrency(loan.monthlyPayment || 0)}
                        </td>
                        <td className="px-4 py-3">
                          {loan.payoffDate ? (
                            <div className="flex flex-col">
                              <span>{new Date(loan.payoffDate).toLocaleDateString()}</span>
                              {loan.monthsToPayoff && (
                                <span className="text-slate-500 text-xs">
                                  ~{loan.monthsToPayoff} months
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-500 text-sm">Insufficient data</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="bg-slate-800 p-8 rounded-xl shadow-md border border-slate-700">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Reports</h2>
                  <p className="text-slate-400 text-sm">
                    Visualize how outstanding loan balances compare and how many months remain until each one is paid off.
                  </p>
                </div>
                <Button variant="secondary" size="small" onClick={handleOpenSettings}>
                  Update Loan Details
                </Button>
              </div>

              {loanReportData.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                  Add loan details in the configuration and record EMI payments to unlock payoff projections.
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={loanReportData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#94a3b8"
                        tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#94a3b8"
                        tickFormatter={(value) => `${value}m`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(value, name) => {
                          if (name === 'Remaining Balance') {
                            return [formatCurrency(value), name];
                          }
                          if (name === 'Months to Payoff') {
                            return [`${value} months`, name];
                          }
                          return [value, name];
                        }}
                      />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="balance"
                        fill="#6366f1"
                        name="Remaining Balance"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="monthsToPayoff"
                        stroke="#f97316"
                        strokeWidth={3}
                        name="Months to Payoff"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

