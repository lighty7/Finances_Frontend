import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/context/AuthContext';
import { ROUTES } from '../../app/routes';
import { usePageTitle } from '../../shared/hooks/usePageTitle';
import { formatCurrency } from '../../shared/utils/constants';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import ToastService from '../../shared/components/Toast';
import * as configurationService from './services/configuration';

const Configuration = () => {
  const { user, checkConfiguration } = useAuth();
  const navigate = useNavigate();
  usePageTitle();

  const [formData, setFormData] = useState({
    totalEmi: '',
    numberOfLoans: '',
    emiSchedule: [{ date: '', amount: '' }],
    income: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing configuration on mount
  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const response = await configurationService.getConfiguration();
        if (response.configuration) {
          const config = response.configuration;
          setFormData({
            totalEmi: config.totalEmi || '',
            numberOfLoans: config.numberOfLoans || '',
            emiSchedule: config.emiSchedule && config.emiSchedule.length > 0
              ? config.emiSchedule.map(item => ({
                  date: item.date ? item.date.split('T')[0] : '',
                  amount: item.amount || '',
                }))
              : [{ date: '', amount: '' }],
            income: config.income || '',
          });
        }
      } catch (error) {
        console.error('Error fetching configuration:', error);
      } finally {
        setFetching(false);
      }
    };

    fetchConfiguration();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmiScheduleChange = (index, field, value) => {
    setFormData((prev) => {
      const newSchedule = [...prev.emiSchedule];
      newSchedule[index] = { ...newSchedule[index], [field]: value };
      return { ...prev, emiSchedule: newSchedule };
    });
  };

  const addEmiScheduleEntry = () => {
    setFormData((prev) => ({
      ...prev,
      emiSchedule: [...prev.emiSchedule, { date: '', amount: '' }],
    }));
  };

  const removeEmiScheduleEntry = (index) => {
    if (formData.emiSchedule.length > 1) {
      setFormData((prev) => ({
        ...prev,
        emiSchedule: prev.emiSchedule.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.totalEmi && parseFloat(formData.totalEmi) < 0) {
      newErrors.totalEmi = 'Total EMI must be a positive number';
    }

    if (formData.numberOfLoans && parseInt(formData.numberOfLoans) < 0) {
      newErrors.numberOfLoans = 'Number of loans must be a non-negative integer';
    }

    if (formData.income && parseFloat(formData.income) < 0) {
      newErrors.income = 'Income must be a positive number';
    }

    // Validate EMI schedule
    formData.emiSchedule.forEach((item, index) => {
      if (item.date && !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
        newErrors[`emiSchedule_${index}_date`] = 'Please enter a valid date (YYYY-MM-DD)';
      }
      if (item.amount && parseFloat(item.amount) < 0) {
        newErrors[`emiSchedule_${index}_amount`] = 'Amount must be a positive number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    // At least income or totalEmi should be provided
    if (!formData.income && !formData.totalEmi) {
      ToastService.error('Please provide at least Income or Total EMI');
      return;
    }

    setLoading(true);

    try {
      // Prepare EMI schedule - filter out empty entries and format
      const emiSchedule = formData.emiSchedule
        .filter(item => item.date && item.amount)
        .map(item => ({
          date: item.date,
          amount: parseFloat(item.amount),
        }));

      const configData = {
        totalEmi: formData.totalEmi ? parseFloat(formData.totalEmi) : null,
        numberOfLoans: formData.numberOfLoans ? parseInt(formData.numberOfLoans) : 0,
        emiSchedule: emiSchedule.length > 0 ? emiSchedule : null,
        income: formData.income ? parseFloat(formData.income) : null,
      };

      const response = await configurationService.createOrUpdateConfiguration(configData);

      if (response) {
        ToastService.success('Configuration saved successfully!');
        // Refresh configuration status in auth context
        await checkConfiguration();
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save configuration';
      ToastService.error(errorMessage);
      
      // Handle validation errors
      if (error.response?.data?.details) {
        const validationErrors = {};
        error.response.data.details.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.msg;
          }
        });
        setErrors(validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-slate-100">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="bg-gradient-to-r from-primary via-primary to-secondary text-white py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Initial Configuration
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">{user?.userName || 'User'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-slate-800 rounded-xl shadow-md p-8 border border-slate-700 animate-fade-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              Set Up Your Financial Profile
            </h2>
            <p className="text-slate-300 text-sm">
              Please provide your initial financial information to get started.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Income */}
            <Input
              label="Monthly Income"
              type="number"
              name="income"
              value={formData.income}
              onChange={handleChange}
              error={errors.income}
              placeholder="Enter your monthly income"
              disabled={loading}
              step="0.01"
              min="0"
            />

            {/* Total EMI */}
            <Input
              label="Total EMI (All Loans Combined)"
              type="number"
              name="totalEmi"
              value={formData.totalEmi}
              onChange={handleChange}
              error={errors.totalEmi}
              placeholder="Enter total EMI amount"
              disabled={loading}
              step="0.01"
              min="0"
            />

            {/* Number of Loans */}
            <Input
              label="Number of Loans"
              type="number"
              name="numberOfLoans"
              value={formData.numberOfLoans}
              onChange={handleChange}
              error={errors.numberOfLoans}
              placeholder="Enter number of active loans"
              disabled={loading}
              min="0"
            />

            {/* EMI Schedule */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-medium text-slate-100 text-sm">
                  EMI Schedule (Optional)
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={addEmiScheduleEntry}
                  disabled={loading}
                >
                  Add Entry
                </Button>
              </div>

              {formData.emiSchedule.map((entry, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block font-medium text-slate-100 text-sm mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={entry.date}
                      onChange={(e) => handleEmiScheduleChange(index, 'date', e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 border-2 rounded-lg text-base font-sans transition-all duration-200 bg-slate-800 text-slate-100 border-slate-700 focus:border-primary focus:ring-3 focus:ring-primary/20"
                    />
                    {errors[`emiSchedule_${index}_date`] && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {errors[`emiSchedule_${index}_date`]}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium text-slate-100 text-sm mb-2">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={entry.amount}
                      onChange={(e) => handleEmiScheduleChange(index, 'amount', e.target.value)}
                      disabled={loading}
                      placeholder="Enter amount"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border-2 rounded-lg text-base font-sans transition-all duration-200 bg-slate-800 text-slate-100 border-slate-700 focus:border-primary focus:ring-3 focus:ring-primary/20"
                    />
                    {errors[`emiSchedule_${index}_amount`] && (
                      <span className="text-red-500 text-sm mt-1 block">
                        {errors[`emiSchedule_${index}_amount`]}
                      </span>
                    )}
                  </div>
                  <div>
                    {formData.emiSchedule.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={() => removeEmiScheduleEntry(index)}
                        disabled={loading}
                        className="w-full"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700">
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Configuration;
