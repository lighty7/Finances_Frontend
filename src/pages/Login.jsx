import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage, formatValidationErrors } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import { usePageTitle } from '../hooks/usePageTitle';
import Input from '../components/Input';
import Button from '../components/Button';
import ToastService from '../components/Toast';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-blue-600 to-secondary p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-slide-up border border-white/20">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm font-medium">Sign in to your Budget Tracker account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Input
              label="Email Address"
              type="email"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              error={errors.emailId}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              disabled={loading}
              required
            />
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:text-secondary font-medium transition-colors">Forgot password?</a>
            </div>
          </div>

          <Button type="submit" loading={loading} disabled={loading} className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-500 text-sm">New to Budget Tracker?</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Sign up link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-primary font-bold hover:text-secondary transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

