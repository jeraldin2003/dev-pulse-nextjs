"use client";
/**
 * MessageComposer.jsx
 * Text input + send button. Enter sends, Shift+Enter inserts a newline.
 * Fires `onTyping` on every keystroke so the parent can debounce the
 * typing:start/typing:stop socket events.
 */
import { useState } from 'react';
import { Send } from 'lucide-react';

const MAX_LENGTH = 2000;

export default function MessageComposer({ onSend, onTyping, disabled }) {
  const [value, setValue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    setValue('');
    const result = await onSend(trimmed);
    if (!result?.success) {
      // Send failed — restore the draft so the user doesn't lose their message
      setValue(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onTyping?.();
        }}
        onKeyDown={handleKeyDown}
        placeholder="Write a message…"
        rows={1}
        maxLength={MAX_LENGTH}
        className="flex-1 resize-none max-h-32 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="shrink-0 w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors duration-150 cursor-pointer"
      >
        <Send size={16} />
      </button>
    </form>
  );
}
