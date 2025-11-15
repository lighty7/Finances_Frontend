import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage, formatValidationErrors } from '../../../shared/utils/helpers';
import { ROUTES } from '../../../app/routes';
import { usePageTitle } from '../../../shared/hooks/usePageTitle';
import Input from '../../../shared/components/Input';
import Button from '../../../shared/components/Button';
import ToastService from '../../../shared/components/Toast';

const Login = () => {
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  
  const [formData, setFormData] = useState({
    emailId: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  usePageTitle();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.emailId) {
      newErrors.emailId = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData);

      if (result.success) {
        ToastService.success('Login successful!');
        // Redirect to returnUrl if provided, otherwise to dashboard
        const destination = returnUrl ? decodeURIComponent(returnUrl) : ROUTES.DASHBOARD;
        navigate(destination, { replace: true });
      } else {
        // Handle email not verified error
        if (result.error?.emailNotVerified) {
          ToastService.error(
            result.error.message || 'Please verify your email before logging in.'
          );
        } else {
          const errorMsg = formatErrorMessage({ response: { data: result.error } });
          ToastService.error(errorMsg);
          const validationErrors = formatValidationErrors({ response: { data: result.error } });
          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
          }
        }
      }
    } catch (error) {
      ToastService.error(formatErrorMessage(error));
      const validationErrors = formatValidationErrors(error);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent animate-pulse-slow"></div>
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-slide-up border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Login
        </h1>
        <p className="text-slate-300 text-center mb-8 text-sm">Welcome back to Budget Tracker</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            error={errors.emailId}
            placeholder="Enter your email"
            disabled={loading}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            disabled={loading}
            required
          />

          <Button type="submit" loading={loading} disabled={loading} className="w-full mt-2">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-slate-300 text-sm">
          <p>
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary font-medium hover:text-secondary transition-colors hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

