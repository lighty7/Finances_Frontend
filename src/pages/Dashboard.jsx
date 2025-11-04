import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { usePageTitle } from '../hooks/usePageTitle';
import Button from '../components/Button';
import ToastService from '../components/Toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  usePageTitle();

  const handleLogout = async () => {
    try {
      await logout();
      ToastService.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      ToastService.error('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Button variant="secondary" size="small" onClick={handleLogout} className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/50">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-8">
          <section className="bg-white p-8 rounded-xl shadow-md animate-fade-in">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">
              Welcome back, {user?.userName || 'User'}!
            </h2>
            <p className="text-gray-600 text-base">Manage your finances effectively with Budget Tracker.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 p-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-4">Total Balance</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">$0.00</p>
              <p className="text-gray-600 text-sm">Current balance</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-green-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mb-4 p-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <h3 className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-4">Income</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">$0.00</p>
              <p className="text-gray-600 text-sm">This month</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-red-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mb-4 p-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
              </div>
              <h3 className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-4">Expenses</h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">$0.00</p>
              <p className="text-gray-600 text-sm">This month</p>
            </div>
          </div>

          <section className="bg-white p-8 rounded-xl shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Transactions</h2>
              <Button variant="primary" size="small">
                Add Transaction
              </Button>
            </div>

            <div className="min-h-[200px]">
              <div className="text-center py-16 px-5 text-gray-600">
                <svg className="mx-auto mb-4 text-gray-400 opacity-50" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <p className="text-base mb-2">No transactions yet.</p>
                <p className="text-sm text-gray-500">Start tracking your finances by adding your first transaction.</p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-xl shadow-md animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-white border-2 border-gray-200 p-4 rounded-lg text-base font-medium text-gray-900 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Add Income</span>
              </button>
              <button className="bg-white border-2 border-gray-200 p-4 rounded-lg text-base font-medium text-gray-900 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
                <span>Add Expense</span>
              </button>
              <button className="bg-white border-2 border-gray-200 p-4 rounded-lg text-base font-medium text-gray-900 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-4 4 4 6-6" />
                </svg>
                <span>View Reports</span>
              </button>
              <button className="bg-white border-2 border-gray-200 p-4 rounded-lg text-base font-medium text-gray-900 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 hover:shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" />
                </svg>
                <span>Settings</span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

