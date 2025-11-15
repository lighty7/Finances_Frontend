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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-blue-600 to-secondary text-white py-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              Budget Tracker
            </h1>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="font-bold text-lg">{user?.userName || 'User'}</span>
              <span className="text-sm opacity-90">{user?.emailId}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </div>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={handleLogout} 
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 hover:border-white/50 transition-all"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Greeting Section */}
        <section className="mb-12 animate-fade-in">
          <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-lg p-10 border border-white/40 backdrop-blur-sm overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full -ml-16 -mb-16"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-primary font-bold text-sm uppercase tracking-wider mb-2">Welcome Back</p>
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-secondary bg-clip-text text-transparent mb-3">
                    {getGreeting()}, {user?.userName || 'User'}! 👋
                  </h2>
                  <p className="text-gray-600 text-lg">Ready to take control of your finances? Let's get started.</p>
                </div>
                <div className="hidden md:flex w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-lg">
                  💰
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Balance */}
          <div className="group bg-white rounded-2xl shadow-md p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">Current</span>
            </div>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">Total Balance</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">$0.00</p>
            <p className="text-gray-500 text-sm">Your current balance</p>
          </div>

          {/* Income */}
          <div className="group bg-white rounded-2xl shadow-md p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-green-400/10 text-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">Total Income</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">$0.00</p>
            <p className="text-gray-500 text-sm">Money coming in</p>
          </div>

          {/* Expenses */}
          <div className="group bg-white rounded-2xl shadow-md p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-400/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
              </div>
              <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">This Month</span>
            </div>
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">Total Expenses</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">$0.00</p>
            <p className="text-gray-500 text-sm">Money going out</p>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="group bg-white border-2 border-gray-200 p-6 rounded-xl text-base font-semibold text-gray-900 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <span>Add Income</span>
            </button>
            <button className="group bg-white border-2 border-gray-200 p-6 rounded-xl text-base font-semibold text-gray-900 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14" />
                </svg>
              </div>
              <span>Add Expense</span>
            </button>
            <button className="group bg-white border-2 border-gray-200 p-6 rounded-xl text-base font-semibold text-gray-900 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" />
                  <path d="M7 16l4-4 4 4 6-6" />
                </svg>
              </div>
              <span>View Reports</span>
            </button>
            <button className="group bg-white border-2 border-gray-200 p-6 rounded-xl text-base font-semibold text-gray-900 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-1">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v6m0 6v6M23 12h-6m-6 0H1" />
                </svg>
              </div>
              <span>Settings</span>
            </button>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Recent Transactions</h3>
            <Button variant="primary" size="small" className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
              Add Transaction
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="min-h-[300px] flex flex-col items-center justify-center py-20 px-6 text-gray-600">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <p className="text-lg font-semibold mb-2">No transactions yet</p>
              <p className="text-sm text-gray-500 text-center max-w-sm">Start tracking your finances by adding your first income or expense. It only takes a second!</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

