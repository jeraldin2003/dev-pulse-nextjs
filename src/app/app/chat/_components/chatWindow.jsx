import { useState } from "react";

const MESSAGES = [
  { id: 1, sender: "them", text: "Hey! Did you get a chance to look at the designs?", time: "9:12 AM" },
  { id: 2, sender: "me", text: "Yep, just opened them now — looking good so far.", time: "9:14 AM" },
  { id: 3, sender: "them", text: "Awesome. Let me know if the spacing on the sidebar feels off.", time: "9:15 AM" },
  { id: 4, sender: "me", text: "Will do. Can you review this?", time: "9:20 AM" },
  { id: 5, sender: "them", text: "Sure, sending feedback in a bit.", time: "9:22 AM" },
];

export default function ChatSpace() {
  const [messages, setMessages] = useState(MESSAGES);
  const [draft, setDraft] = useState("");

  const activeUser = {
    name: "Nadia Hassan",
    status: "online",
    initials: "NH",
  };

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "me",
        text,
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      },
    ]);
    setDraft("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex h-screen min-h-0 flex-1 flex-col overflow-hidden bg-neutral-950 text-neutral-100">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-800 px-5 py-3">
        <div className="relative flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-700 text-xs font-medium">
            {activeUser.initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-neutral-950 bg-green-500" />
        </div>
        <div>
          <p className="text-sm font-medium">{activeUser.name}</p>
          <p className="text-xs text-neutral-500">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((msg) => {
          const isMe = msg.sender === "me";
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-xs sm:max-w-sm ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                <div
                  className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    isMe
                      ? "rounded-br-sm bg-orange-600 text-white"
                      : "rounded-bl-sm bg-neutral-800 text-neutral-100"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 px-1 text-[11px] text-neutral-500">
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-neutral-800 px-4 py-3">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message"
            rows={1}
            className="max-h-32 flex-1 resize-none rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 outline-none focus:border-neutral-500"
          />
          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="flex-shrink-0 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}