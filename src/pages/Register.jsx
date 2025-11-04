import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage, formatValidationErrors } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import { usePageTitle } from '../hooks/usePageTitle';
import Input from '../components/Input';
import Button from '../components/Button';
import ToastService from '../components/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    userName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userName.trim()) {
      newErrors.userName = 'Username is required';
    } else if (formData.userName.length < 3) {
      newErrors.userName = 'Username must be at least 3 characters';
    } else if (formData.userName.length > 50) {
      newErrors.userName = 'Username must be less than 50 characters';
    }

    if (!formData.emailId) {
      newErrors.emailId = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        userName: formData.userName,
        emailId: formData.emailId,
        password: formData.password,
      });

      if (result.success) {
        ToastService.success(
          result.data.message || 'Registration successful! Please check your email to verify your account.'
        );
        // Redirect to verification page after 2 seconds
        setTimeout(() => {
          navigate(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(formData.emailId)}`);
        }, 2000);
      } else {
        const errorMsg = formatErrorMessage({ response: { data: result.error } });
        ToastService.error(errorMsg);
        const apiErrors = formatValidationErrors({ response: { data: result.error } });
        if (Object.keys(apiErrors).length > 0) {
          setErrors(apiErrors);
        }
      }
    } catch (error) {
      ToastService.error(formatErrorMessage(error));
      const apiErrors = formatValidationErrors(error);
      if (Object.keys(apiErrors).length > 0) {
        setErrors(apiErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent animate-pulse-slow"></div>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-slide-up">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Sign Up
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm">Create your Budget Tracker account</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Username"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            error={errors.userName}
            placeholder="Enter your username"
            disabled={loading}
            required
          />

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

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            disabled={loading}
            required
          />

          <Button type="submit" loading={loading} disabled={loading} className="w-full mt-2">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:text-secondary transition-colors hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

