import { KeyRound, Mail, Lock } from 'lucide-react';
import { InputField } from './InputField.jsx';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner.jsx';

export function ForgotPasswordForm({
  onSwitch,
  step,
  loading,
  onSendResetOtp,
  onResetPassword,
  formData,
  handleChange,
}) {
  if (step === 2) {
    return (
      <form onSubmit={onResetPassword} className="flex flex-col gap-4 dp-fade-in">
        <div className="text-center mb-2">
          <p className="text-sm text-slate-650 mb-1">Reset code sent to</p>
          <p className="font-semibold text-slate-850">{formData.forgotEmail}</p>
        </div>
        <InputField
          icon={KeyRound}
          type="text"
          placeholder="Reset OTP code"
          value={formData.forgotOtp}
          onChange={(e) => handleChange('forgotOtp', e.target.value)}
        />
        <InputField
          icon={Lock}
          type="password"
          placeholder="New password"
          value={formData.forgotNewPassword}
          onChange={(e) => handleChange('forgotNewPassword', e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? <LoadingSpinner /> : 'Update Password'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSendResetOtp} className="flex flex-col gap-4 dp-fade-in">
      <InputField
        icon={Mail}
        type="email"
        placeholder="Email address"
        value={formData.forgotEmail}
        onChange={(e) => handleChange('forgotEmail', e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? <LoadingSpinner /> : 'Send Reset Code'}
      </button>
      <button
        type="button"
        onClick={() => onSwitch('login')}
        className="text-sm font-semibold text-slate-500 hover:text-slate-700 mt-4 transition-colors cursor-pointer"
      >
        Back to Login
      </button>
    </form>
  );
}
