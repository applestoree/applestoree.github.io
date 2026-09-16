import { useState } from 'react';

const chats = [
  { name: 'Apple Store Malaysia', message: 'Welcome to the store chat.', time: '09:42', unread: 2, avatar: 'A' },
  { name: 'Customer Support', message: 'How can we help you today?', time: '09:18', unread: 0, avatar: 'CS' },
  { name: 'Project Team', message: 'The latest update is ready.', time: 'Yesterday', unread: 4, avatar: 'PT' },
  { name: 'Marketing', message: 'New campaign assets are available.', time: 'Yesterday', unread: 0, avatar: 'M' },
  { name: 'Family', message: 'See you later.', time: 'Monday', unread: 0, avatar: 'F' },
];

function Header({ onMenu }) {
  return (
    <header className="flex shrink-0 items-center justify-between bg-[#075e54] px-4 py-3 text-white">
      <h1 className="text-xl font-semibold">WhatsApp</h1>
      <div className="flex items-center gap-1">
        <button className="rounded-full px-3 py-2 text-xl" aria-label="Search">⌕</button>
        <button className="rounded-full px-3 py-2 text-xl" aria-label="More options" onClick={onMenu}>⋮</button>
      </div>
    </header>
  );
}

function Main() {
  const [query, setQuery] = useState('');
  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.message}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#efeae2]">
      <div className="px-4 py-2">
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <span className="text-lg text-gray-500">⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search chats"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
      </div>

      <div className="bg-white">
        {filteredChats.map((chat) => (
          <button
            key={chat.name}
            className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d9fdd3] font-semibold text-[#075e54]">
              {chat.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[16px] font-medium text-gray-900">{chat.name}</span>
                <span className="shrink-0 text-xs text-gray-500">{chat.time}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="truncate text-sm text-gray-500">{chat.message}</span>
                {chat.unread > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#25d366] px-1.5 text-[11px] font-semibold text-white">
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}

function BottomNav() {
  return (
    <nav className="grid shrink-0 grid-cols-4 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <button className="flex flex-col items-center gap-1 py-2 text-xs font-medium text-[#075e54]" aria-label="Chats">
        <span className="text-xl">◉</span>
        <span>Chats</span>
      </button>
      <button className="flex flex-col items-center gap-1 py-2 text-xs text-gray-500" aria-label="Updates">
        <span className="text-xl">◌</span>
        <span>Updates</span>
      </button>
      <button className="flex flex-col items-center gap-1 py-2 text-xs text-gray-500" aria-label="Communities">
        <span className="text-xl">⌘</span>
        <span>Communities</span>
      </button>
      <button className="flex flex-col items-center gap-1 py-2 text-xs text-gray-500" aria-label="Calls">
        <span className="text-xl">☎</span>
        <span>Calls</span>
      </button>
    </nav>
  );
}

function Overlay({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/10" onClick={onClose}>
      <div
        className="absolute right-3 top-14 min-w-48 rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/10"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="block w-full rounded-lg px-4 py-3 text-left text-sm hover:bg-gray-100">New group</button>
        <button className="block w-full rounded-lg px-4 py-3 text-left text-sm hover:bg-gray-100">Settings</button>
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden bg-white">
      <Header onMenu={() => setMenuOpen((value) => !value)} />
      <Main />
      <BottomNav />
      <Overlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
