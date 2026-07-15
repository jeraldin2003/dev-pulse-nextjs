import { useState } from "react";

const USERS = [
  { id: 1, name: "Amara Chen", status: "online", lastMessage: "Sounds good, see you then!", unread: 2, initials: "AC" },
  { id: 2, name: "Diego Reyes", status: "online", lastMessage: "Sent the files over", unread: 0, initials: "DR" },
  { id: 3, name: "Priya Sharma", status: "away", lastMessage: "Let's sync tomorrow", unread: 0, initials: "PS" },
  { id: 4, name: "Liam O'Connor", status: "offline", lastMessage: "Thanks for the update", unread: 0, initials: "LO" },
  { id: 5, name: "Nadia Hassan", status: "online", lastMessage: "Can you review this?", unread: 5, initials: "NH" },
  { id: 6, name: "Tom Becker", status: "offline", lastMessage: "See you at the meeting", unread: 0, initials: "TB" },
];

const STATUS_DOT = {
  online: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-gray-500",
};

export default function ChatBar() {
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(1);

  const filtered = USERS.filter((u) =>
    u.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-full w-72 flex-col border-r border-neutral-800 bg-neutral-900 text-neutral-100">
      {/* Header */}
      <div className="px-4 pb-3 pt-5">
        <h2 className="text-base font-medium">Chats</h2>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-neutral-500"
        />
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.length === 0 && (
          <p className="px-2 py-3 text-sm text-neutral-500">No matches.</p>
        )}

        {filtered.map((user) => {
          const isActive = user.id === activeId;
          return (
            <button
              key={user.id}
              onClick={() => setActiveId(user.id)}
              className={`mb-0.5 flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors ${
                isActive ? "bg-neutral-800" : "hover:bg-neutral-800/60"
              }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-700 text-xs font-medium text-neutral-100">
                  {user.initials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-neutral-900 ${STATUS_DOT[user.status]}`}
                />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-xs text-neutral-500">
                  {user.lastMessage}
                </p>
              </div>

              {/* Unread badge */}
              {user.unread > 0 && (
                <span className="flex-shrink-0 rounded-full bg-orange-600 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  {user.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}