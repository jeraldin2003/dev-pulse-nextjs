/**
 * ContactList.jsx
 * Left panel of the chat page: existing conversations (most recent first,
 * with a preview + unread badge) and a "Start a new chat" section for every
 * other registered user you haven't messaged yet.
 */
import { Search, MessageSquarePlus } from 'lucide-react';
import { EmptyState } from '@/components/ui';

function getInitials(name = '') {
  return name.trim().slice(0, 2).toUpperCase();
}

function OnlineDot({ online }) {
  return (
    <span
      className={[
        'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900',
        online ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600',
      ].join(' ')}
      aria-label={online ? 'Online' : 'Offline'}
    />
  );
}

function Avatar({ username, online }) {
  return (
    <div className="relative shrink-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold select-none">
        {getInitials(username)}
      </div>
      <OnlineDot online={online} />
    </div>
  );
}

function ConversationRow({ conversation, isActive, isOnline, onSelect, currentUserId }) {
  const unread = Number(conversation.unread_count) || 0;
  const isOwnLastMessage = conversation.last_message_sender_id === currentUserId;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.partner_id, conversation.partner_username)}
      className={[
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 cursor-pointer',
        isActive ? 'bg-blue-50 dark:bg-blue-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
      ].join(' ')}
    >
      <Avatar username={conversation.partner_username} online={isOnline} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
            {conversation.partner_username}
          </span>
        </div>
        <p className="text-xs text-slate-400 truncate">
          {isOwnLastMessage && <span className="text-slate-400">You: </span>}
          {conversation.last_message}
        </p>
      </div>
      {unread > 0 && (
        <span className="shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </button>
  );
}

function UserRow({ contactUser, isActive, isOnline, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(contactUser.id, contactUser.username)}
      className={[
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-150 cursor-pointer',
        isActive ? 'bg-blue-50 dark:bg-blue-950/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
      ].join(' ')}
    >
      <Avatar username={contactUser.username} online={isOnline} />
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
        {contactUser.username}
      </span>
    </button>
  );
}

export default function ContactList({
  conversations,
  usersWithoutConversation,
  onlineUserIds,
  activePartnerId,
  onSelectContact,
  searchTerm,
  onSearchChange,
  currentUserId,
}) {
  const term = searchTerm.trim().toLowerCase();
  const filteredConversations = term
    ? conversations.filter((c) => c.partner_username.toLowerCase().includes(term))
    : conversations;
  const filteredUsers = term
    ? usersWithoutConversation.filter((u) => u.username.toLowerCase().includes(term))
    : usersWithoutConversation;

  const nothingToShow = filteredConversations.length === 0 && filteredUsers.length === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-100 dark:border-slate-700 shrink-0">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search people…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {nothingToShow && (
          <EmptyState
            icon={MessageSquarePlus}
            title="No people found"
            message="Try a different search term."
          />
        )}

        {filteredConversations.length > 0 && (
          <div className="mb-2">
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Conversations
            </p>
            <div className="flex flex-col gap-0.5">
              {filteredConversations.map((c) => (
                <ConversationRow
                  key={c.partner_id}
                  conversation={c}
                  isActive={c.partner_id === activePartnerId}
                  isOnline={onlineUserIds.has(c.partner_id)}
                  onSelect={onSelectContact}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div>
            <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Start a new chat
            </p>
            <div className="flex flex-col gap-0.5">
              {filteredUsers.map((u) => (
                <UserRow
                  key={u.id}
                  contactUser={u}
                  isActive={u.id === activePartnerId}
                  isOnline={onlineUserIds.has(u.id)}
                  onSelect={onSelectContact}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
