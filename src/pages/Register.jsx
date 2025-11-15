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
  const [step, setStep] = useState(1); // Multi-step form

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

  const validateStep1 = () => {
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
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
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

  const handleNextStep = () => {
    const newErrors = validateStep1();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateStep2();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-blue-600 to-secondary p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Sign Up Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-slide-up border border-white/20">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-gray-600 text-center mb-8 text-sm font-medium">Join Budget Tracker and manage your finances</p>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          <div className={`h-1 flex-1 rounded-full transition-all ${step === 1 ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-300'}`}></div>
          <div className={`h-1 flex-1 rounded-full transition-all ${step === 2 ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-gray-300'}`}></div>
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="space-y-5">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Input
                  label="Username"
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  error={errors.userName}
                  placeholder="johndoe"
                  disabled={loading}
                  required
                />
              </div>

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

              <Button type="submit" disabled={loading} className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Next Step
              </Button>
            </>
          ) : (
            <>
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
                <p className="text-xs text-gray-500">At least 6 characters</p>
              </div>

              <div className="space-y-2">
                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => { setStep(1); setErrors({}); }}
                  className="flex-1 border-2 border-primary text-primary hover:bg-primary/5"
                >
                  Back
                </Button>
                <Button type="submit" loading={loading} disabled={loading} className="flex-1 bg-gradient-to-r from-primary to-secondary hover:shadow-lg">
                  {loading ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-500 text-sm">Already signed up?</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Login link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary font-bold hover:text-secondary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

