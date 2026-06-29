import { User as UserIcon, Lock, ArrowRight } from 'lucide-react';
import { InputField } from './InputField.jsx';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner.jsx';

export function LoginForm({ onSwitch, loading, onSubmit, formData, handleChange }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 dp-fade-in">
      <InputField
        icon={UserIcon}
        type="text"
        placeholder="Username or Email"
        value={formData.loginIdentifier}
        onChange={(e) => handleChange('loginIdentifier', e.target.value)}
      />
      <InputField
        icon={Lock}
        type="password"
        placeholder="Password"
        value={formData.loginPassword}
        onChange={(e) => handleChange('loginPassword', e.target.value)}
      />

      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={() => onSwitch('forgot')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-sm shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
      >
        {loading ? <LoadingSpinner /> : 'Sign In'}
        {!loading && (
          <ArrowRight
            size={18}
            className="opacity-70 group-hover:translate-x-1 transition-transform"
          />
        )}
      </button>

      <p className="text-center text-sm text-slate-500 mt-4">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitch('register')}
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors focus:outline-none"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
