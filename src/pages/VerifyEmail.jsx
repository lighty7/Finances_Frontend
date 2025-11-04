import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatErrorMessage } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import { usePageTitle } from '../hooks/usePageTitle';
import Input from '../components/Input';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import ToastService from '../components/Toast';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');
  
  const [email, setEmail] = useState(emailParam || '');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  usePageTitle();

  useEffect(() => {
    // Auto-verify if token is present in URL
    if (token && !verifying && !verified) {
      handleVerify(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleVerify = async (verificationToken) => {
    if (!verificationToken) {
      ToastService.error('Verification token is required');
      return;
    }

    setVerifying(true);

    try {
      const result = await verifyEmail(verificationToken);

      if (result.success) {
        setVerified(true);
        ToastService.success(
          result.data.message || 'Email verified successfully! You can now login.'
        );
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
      } else {
        ToastService.error(formatErrorMessage({ response: { data: result.error } }));
      }
    } catch (error) {
      ToastService.error(formatErrorMessage(error));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      ToastService.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const result = await resendVerification(email);

      if (result.success) {
        ToastService.success(
          result.data.message || 'Verification email has been sent. Please check your inbox.'
        );
      } else {
        ToastService.error(formatErrorMessage({ response: { data: result.error } }));
      }
    } catch (error) {
      ToastService.error(formatErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary to-secondary p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent animate-pulse-slow"></div>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative z-10 animate-slide-up text-center">
        <div className="mb-6 flex justify-center text-primary">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Verify Your Email
        </h1>
        <p className="text-gray-600 mb-8 text-sm">
          {token && verifying
            ? 'Verifying your email address...'
            : token && verified
            ? 'Email verified successfully!'
            : 'Please verify your email address to complete your registration'}
        </p>

        {token ? (
          <div className="py-8">
            {verifying ? (
              <div className="flex flex-col items-center gap-4 p-6">
                <LoadingSpinner size="medium" message="" />
                <p className="text-gray-600">Verifying...</p>
              </div>
            ) : verified ? (
              <div className="flex flex-col items-center gap-4 p-6 text-green-500">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p className="text-gray-600">Redirecting to login...</p>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => handleVerify(token)}
                disabled={verifying}
                className="w-full"
              >
                Verify Email
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6 text-left">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              disabled={loading || verifying}
            />

            <Button
              type="button"
              onClick={handleResend}
              loading={loading}
              disabled={loading || verifying || !email}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
          </div>
        )}

        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            Already verified?{' '}
            <Link to={ROUTES.LOGIN} className="text-primary font-medium hover:text-secondary transition-colors hover:underline">
              Go to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

