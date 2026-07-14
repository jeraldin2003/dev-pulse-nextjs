/**
 * TypingIndicator.jsx
 * Small animated "•••" bubble shown while the other person is typing.
 */
export default function TypingIndicator({ username }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 rounded-2xl rounded-bl-md">
        <span className="sr-only">{username} is typing</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 dp-typing-dot"
            style={{ animationDelay: `${i * 0.15}s` }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
