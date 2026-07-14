"use client";
/**
 * ChatWindow.jsx
 * The right-hand panel: conversation header (avatar, name, online status),
 * scrollable message thread, typing indicator, and the composer.
 * All chat-thread state lives in useChatThread — this component is purely
 * about rendering it.
 */
import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { EmptyState, ErrorBanner, SkeletonCard } from '@/components/ui';
import { useChatThread } from '../_hooks/useChatThread.js';
import MessageBubble from './MessageBubble.jsx';
import MessageComposer from './MessageComposer.jsx';
import TypingIndicator from './TypingIndicator.jsx';

function getInitials(name = '') {
  return name.trim().slice(0, 2).toUpperCase();
}

export default function ChatWindow({ partnerId, partnerUsername, isPartnerOnline }) {
  const {
    messages,
    loading,
    error,
    sending,
    sendMessage,
    notifyTyping,
    partnerIsTyping,
    partnerLastReadAt,
    currentUserId,
  } = useChatThread(partnerId);

  const scrollRef = useRef(null);

  // Keep the thread scrolled to the latest message
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, partnerIsTyping]);

  if (!partnerId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          icon={MessageCircle}
          title="Select someone to chat with"
          message="Pick a conversation or start a new one from the list on the left."
        />
      </div>
    );
  }

  const lastOwnMessageId = [...messages].reverse().find((m) => m.senderId === currentUserId)?.id;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {getInitials(partnerUsername)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {partnerUsername}
          </p>
          <p className={`text-xs ${isPartnerOnline ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`}>
            {isPartnerOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5 bg-slate-50 dark:bg-slate-950/60">
        {loading && <SkeletonCard rows={5} />}
        {error && <ErrorBanner message={`Failed to load messages: ${error}`} />}

        {!loading && !error && messages.length === 0 && (
          <EmptyState
            icon={MessageCircle}
            title="No messages yet"
            message={`Say hello to ${partnerUsername}!`}
          />
        )}

        {!loading &&
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUserId}
              isSeen={
                message.id === lastOwnMessageId &&
                Boolean(partnerLastReadAt) &&
                message.senderId === currentUserId
              }
            />
          ))}

        {partnerIsTyping && <TypingIndicator username={partnerUsername} />}
      </div>

      {/* Composer */}
      <MessageComposer onSend={sendMessage} onTyping={notifyTyping} disabled={sending} />
    </div>
  );
}
