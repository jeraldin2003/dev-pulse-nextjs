/**
 * MessageBubble.jsx
 * Renders one message. `body` is plain text and React escapes it by default
 * (no dangerouslySetInnerHTML anywhere here), so user input can never be
 * interpreted as HTML/JS.
 */
function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, isOwnMessage, isSeen }) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[75%] sm:max-w-[60%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap',
          isOwnMessage
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-md',
        ].join(' ')}
      >
        {message.body}
        <div
          className={[
            'flex items-center gap-1 mt-1 text-[10px]',
            isOwnMessage ? 'text-blue-100/80 justify-end' : 'text-slate-400',
          ].join(' ')}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwnMessage && isSeen && <span>· Seen</span>}
        </div>
      </div>
    </div>
  );
}
