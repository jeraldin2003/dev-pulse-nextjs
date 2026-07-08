"use client";
import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Activity, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext.jsx';
import { LoginForm } from './_components/LoginForm.jsx';
import { RegisterForm } from './_components/RegisterForm.jsx';
import { ForgotPasswordForm } from './_components/ForgotPasswordForm.jsx';
import { ErrorBanner } from '@/components/ui/ErrorBanner.jsx';
import { useTheme } from '@/context/ThemeContext.jsx';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner.jsx';

export function LoginPage() {
  const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot'
  const [step, setStep] = useState(1); // Step 1: Info, Step 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { login, loginByEmail, register, sendOtp, forgotPassword, resetPassword, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    loginIdentifier: '',
    loginPassword: '',
    regUsername: '',
    regEmail: '',
    regPassword: '',
    regOtp: '',
    forgotEmail: '',
    forgotOtp: '',
    forgotNewPassword: '',
  });

  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/app/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  // Show spinner while auth is loading OR while we're mid-redirect
  if (isLoading || isAuthenticated) {
    return <LoadingSpinner size={50} />;
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSwitchView = (newView) => {
    setView(newView);
    setStep(1);
    setError('');
    setSuccessMsg('');
    setFormData((prev) => ({
      ...prev,
      regOtp: '',
      forgotOtp: '',
      forgotNewPassword: '',
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { loginIdentifier, loginPassword } = formData;
    const isEmail = loginIdentifier.includes('@');
    const loginFn = isEmail ? loginByEmail : login;

    const result = await loginFn(loginIdentifier, loginPassword);
    setLoading(false);

    if (result.success) {
      redirect('/app/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleSendRegOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await sendOtp(formData.regEmail);
    setLoading(false);

    if (result.success) {
      setStep(2);
      setSuccessMsg('OTP sent to your email.');
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyRegOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(
      formData.regUsername,
      formData.regPassword,
      formData.regEmail,
      formData.regOtp
    );
    setLoading(false);

    if (result.success) {
      router.push('/app/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await forgotPassword(formData.forgotEmail);
    setLoading(false);

    if (result.success) {
      setStep(2);
      setSuccessMsg('Reset code sent to your email.');
    } else {
      setError(result.error || 'Failed to send reset code');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await resetPassword(
      formData.forgotEmail,
      formData.forgotOtp,
      formData.forgotNewPassword
    );
    setLoading(false);

    if (result.success) {
      handleSwitchView('login');
      setSuccessMsg('Password updated successfully. You can now log in.');
    } else {
      setError(result.error || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden">
      {/* Theme Toggle Button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-600 hover:bg-slate-100 transition-all duration-150 cursor-pointer shadow-sm"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-blue-100/40 dark:bg-blue-950/20 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-100/40 dark:bg-indigo-950/20 blur-3xl" />
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto px-6 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 mb-4">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {view === 'login'
              ? 'Welcome back'
              : view === 'register'
                ? 'Create an account'
                : 'Reset password'}
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 text-center max-w-sm">
            {view === 'login'
              ? 'Enter your credentials to access your dashboard'
              : view === 'register'
                ? 'Sign up to start tracking your development metrics'
                : step === 1
                  ? "Enter your email and we'll send you a reset code"
                  : 'Check your inbox for the 6-digit verification code'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/40 rounded-3xl p-8 shadow-xl dark:shadow-black/20">
          <ErrorBanner message={error} />
          {successMsg && !error && (
            <div className="p-3 mb-5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium rounded-xl text-center dp-fade-in border border-emerald-100 dark:border-emerald-900/30">
              {successMsg}
            </div>
          )}

          {view === 'login' && (
            <LoginForm
              onSwitch={handleSwitchView}
              loading={loading}
              onSubmit={handleLogin}
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {view === 'register' && (
            <RegisterForm
              onSwitch={handleSwitchView}
              step={step}
              loading={loading}
              onSendOtp={handleSendRegOtp}
              onVerifyOtp={handleVerifyRegOtp}
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {view === 'forgot' && (
            <ForgotPasswordForm
              onSwitch={handleSwitchView}
              step={step}
              loading={loading}
              onSendResetOtp={handleSendResetOtp}
              onResetPassword={handleResetPassword}
              formData={formData}
              handleChange={handleChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;