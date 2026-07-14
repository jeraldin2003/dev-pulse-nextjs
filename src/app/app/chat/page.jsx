/**
 * ChatPage.jsx
 * Live chat between DevPulse users, backed by Socket.IO.
 * Left: contact list (conversations + all users). Right: active thread.
 */
"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ErrorBanner, SkeletonCard } from '@/components/ui';
import { ErrorBoundary } from '@/components/layout';
import { useAuth } from '@/context/AuthContext.jsx';
import { useChat, ChatProvider } from '@/context/ChatContext.jsx';
import { useContacts } from './_hooks/useContacts.js';
import { usePresence } from './_hooks/usePresence.js';
import { ContactList, ChatWindow } from './_components/index.js';

function ChatPageContent() {
  const { user } = useAuth();
  const { clearUnreadFor, setActiveConversation } = useChat();
  const {
    conversations,
    usersWithoutConversation,
    loading,
    error,
    setActivePartnerId,
    clearUnread,
  } = useContacts();
  const onlineUserIds = usePresence();

  const [activePartner, setActivePartner] = useState(null); // { id, username } | null
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelectContact = useCallback(
    (id, username) => {
      setActivePartner({ id, username });
      setActivePartnerId(id);
      setActiveConversation(id);

      const existing = conversations.find((c) => c.partner_id === id);
      clearUnreadFor(id, existing?.unread_count);
      clearUnread(id);
    },
    [conversations, setActivePartnerId, setActiveConversation, clearUnreadFor, clearUnread]
  );

  // Stop treating any conversation as "active" once the user navigates away
  useEffect(() => {
    return () => {
      setActivePartnerId(null);
      setActiveConversation(null);
    };
  }, [setActivePartnerId, setActiveConversation]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen -m-5 md:-m-8">
      <div className="px-5 md:px-8 pt-5 md:pt-8 pb-4 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Chat</h1>
      </div>

      <div className="flex-1 flex min-h-0 border-t border-slate-100 dark:border-slate-700">
        <aside className="w-full sm:w-72 md:w-80 border-r border-slate-100 dark:border-slate-700 shrink-0 flex flex-col min-h-0 bg-white dark:bg-slate-900">
          {loading ? (
            <div className="p-4">
              <SkeletonCard rows={5} />
            </div>
          ) : error ? (
            <div className="p-4">
              <ErrorBanner message={`Failed to load contacts: ${error}`} />
            </div>
          ) : (
            <ContactList
              conversations={conversations}
              usersWithoutConversation={usersWithoutConversation}
              onlineUserIds={onlineUserIds}
              activePartnerId={activePartner?.id ?? null}
              onSelectContact={handleSelectContact}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              currentUserId={user?.id}
            />
          )}
        </aside>

        <section className="hidden sm:flex flex-1 min-h-0 flex-col bg-white dark:bg-slate-900">
          <ChatWindow
            partnerId={activePartner?.id ?? null}
            partnerUsername={activePartner?.username}
            isPartnerOnline={activePartner ? onlineUserIds.has(activePartner.id) : false}
          />
        </section>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push('/login');
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="p-4">
        <SkeletonCard rows={6} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ChatProvider>
        <ChatPageContent />
      </ChatProvider>
    </ErrorBoundary>
  );
}
