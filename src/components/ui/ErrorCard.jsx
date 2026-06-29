import { AlertCircle } from 'lucide-react';

export default function ErrorCard({ message }) {
  return (
    <div className="flex items-start gap-3 p-5 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450 rounded-lg text-rose-800">
      <AlertCircle size={20} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold mb-1">Data unavailable</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}
