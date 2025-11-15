import { useAuth } from '../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/routes';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { formatCurrency } from '../../shared/utils/constants';
import Button from '../../shared/components/Button';
import ToastService from '../../shared/components/Toast';

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
            <Button variant="secondary" size="small" onClick={handleLogout} className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/50">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col gap-8">
          <section className="bg-slate-800 p-8 rounded-xl shadow-md animate-fade-in border border-slate-700">
            <h2 className="text-3xl font-bold mb-2 text-slate-100">
              Welcome back, {user?.userName || 'User'}!
            </h2>
            <p className="text-slate-300 text-base">Manage your finances effectively with Budget Tracker.</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-8 rounded-xl shadow-md border-l-4 border-primary transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in border border-slate-700">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 p-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9494914,6 C13.4853936,6.52514205 13.8531598,7.2212202 13.9645556,8 L17.5,8 C17.7761424,8 18,8.22385763 18,8.5 C18,8.77614237 17.7761424,9 17.5,9 L13.9645556,9 C13.7219407,10.6961471 12.263236,12 10.5,12 L7.70710678,12 L13.8535534,18.1464466 C14.0488155,18.3417088 14.0488155,18.6582912 13.8535534,18.8535534 C13.6582912,19.0488155 13.3417088,19.0488155 13.1464466,18.8535534 L6.14644661,11.8535534 C5.83146418,11.538571 6.05454757,11 6.5,11 L10.5,11 C11.709479,11 12.7183558,10.1411202 12.9499909,9 L6.5,9 C6.22385763,9 6,8.77614237 6,8.5 C6,8.22385763 6.22385763,8 6.5,8 L12.9499909,8 C12.7183558,6.85887984 11.709479,6 10.5,6 L6.5,6 C6.22385763,6 6,5.77614237 6,5.5 C6,5.22385763 6.22385763,5 6.5,5 L10.5,5 L17.5,5 C17.7761424,5 18,5.22385763 18,5.5 C18,5.77614237 17.7761424,6 17.5,6 L12.9494914,6 L12.9494914,6 Z"></path>
                </svg>
              </div>
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">Total Balance</h3>
              <p className="text-3xl font-bold text-slate-100 mb-2">{formatCurrency(0)}</p>
              <p className="text-slate-400 text-sm">Current balance</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl shadow-md border-l-4 border-green-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in border border-slate-700" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center mb-4 p-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">Income</h3>
              <p className="text-3xl font-bold text-slate-100 mb-2">{formatCurrency(0)}</p>
              <p className="text-slate-400 text-sm">This month</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-xl shadow-md border-l-4 border-red-500 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg animate-fade-in border border-slate-700" style={{ animationDelay: '0.2s' }}>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center mb-4 p-3">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
              </div>
              <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">Expenses</h3>
              <p className="text-3xl font-bold text-slate-100 mb-2">{formatCurrency(0)}</p>
              <p className="text-slate-400 text-sm">This month</p>
            </div>
          </div>

          <section className="bg-slate-800 p-8 rounded-xl shadow-md animate-fade-in border border-slate-700" style={{ animationDelay: '0.4s' }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">Recent Transactions</h2>
              <Button variant="primary" size="small">
                Add Transaction
              </Button>
            </div>

            <div className="min-h-[200px]">
              <div className="text-center py-16 px-5 text-slate-400">
                <svg className="mx-auto mb-4 text-slate-500 opacity-50" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.9494914,6 C13.4853936,6.52514205 13.8531598,7.2212202 13.9645556,8 L17.5,8 C17.7761424,8 18,8.22385763 18,8.5 C18,8.77614237 17.7761424,9 17.5,9 L13.9645556,9 C13.7219407,10.6961471 12.263236,12 10.5,12 L7.70710678,12 L13.8535534,18.1464466 C14.0488155,18.3417088 14.0488155,18.6582912 13.8535534,18.8535534 C13.6582912,19.0488155 13.3417088,19.0488155 13.1464466,18.8535534 L6.14644661,11.8535534 C5.83146418,11.538571 6.05454757,11 6.5,11 L10.5,11 C11.709479,11 12.7183558,10.1411202 12.9499909,9 L6.5,9 C6.22385763,9 6,8.77614237 6,8.5 C6,8.22385763 6.22385763,8 6.5,8 L12.9499909,8 C12.7183558,6.85887984 11.709479,6 10.5,6 L6.5,6 C6.22385763,6 6,5.77614237 6,5.5 C6,5.22385763 6.22385763,5 6.5,5 L10.5,5 L17.5,5 C17.7761424,5 18,5.22385763 18,5.5 C18,5.77614237 17.7761424,6 17.5,6 L12.9494914,6 L12.9494914,6 Z"></path>
                </svg>

                <p className="text-base mb-2">No transactions yet. </p>
                <p className="text-sm text-slate-500">Start tracking your finances by adding your first transaction.</p>
              </div>
            </div>
          </section>

          <section className="bg-slate-800 p-8 rounded-xl shadow-md animate-fade-in border border-slate-700" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-slate-700 border-2 border-slate-600 p-4 rounded-lg text-base font-medium text-slate-100 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>Add Income</span>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 p-4 rounded-lg text-base font-medium text-slate-100 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
                <span>Add Expense</span>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 p-4 rounded-lg text-base font-medium text-slate-100 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-4 4 4 6-6" />
                </svg>
                <span>View Reports</span>
              </button>
              <button className="bg-slate-700 border-2 border-slate-600 p-4 rounded-lg text-base font-medium text-slate-100 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-sm">
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

