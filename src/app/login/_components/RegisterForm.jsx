import { KeyRound, Mail, Lock, User as UserIcon } from 'lucide-react';
import { InputField } from './InputField.jsx';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner.jsx';

export function RegisterForm({
  onSwitch,
  step,
  loading,
  onSendOtp,
  onVerifyOtp,
  formData,
  handleChange,
}) {
  if (step === 2) {
    return (
      <form onSubmit={onVerifyOtp} className="flex flex-col gap-4 dp-fade-in">
        <div className="text-center mb-2">
          <p className="text-sm text-slate-650 mb-1">We sent a code to</p>
          <p className="font-semibold text-slate-850">{formData.regEmail}</p>
        </div>
        <InputField
          icon={KeyRound}
          type="text"
          placeholder="6-digit OTP code"
          value={formData.regOtp}
          onChange={(e) => handleChange('regOtp', e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? <LoadingSpinner /> : 'Verify & Create Account'}
        </button>
        <button
          type="button"
          onClick={() => onSwitch('register')}
          className="text-sm font-semibold text-slate-500 hover:text-slate-700 mt-4 transition-colors cursor-pointer"
        >
          Back
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSendOtp} className="flex flex-col gap-4 dp-fade-in">
      <InputField
        icon={UserIcon}
        type="text"
        placeholder="Username"
        value={formData.regUsername}
        onChange={(e) => handleChange('regUsername', e.target.value)}
      />
      <InputField
        icon={Mail}
        type="email"
        placeholder="Email address"
        value={formData.regEmail}
        onChange={(e) => handleChange('regEmail', e.target.value)}
      />
      <InputField
        icon={Lock}
        type="password"
        placeholder="Password"
        value={formData.regPassword}
        onChange={(e) => handleChange('regPassword', e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? <LoadingSpinner /> : 'Continue'}
      </button>

      <p className="text-center text-sm text-slate-500 mt-4">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitch('login')}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
