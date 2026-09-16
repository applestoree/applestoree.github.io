import { useState } from 'react';
import {
  Badge,
  Block,
  List,
  ListItem,
  Navbar,
  Searchbar,
  Tabbar,
  TabbarLink,
  ToolbarPane,
} from 'konsta/react';

const chats = [
  { name: 'Apple Store Malaysia', message: 'Welcome to the store chat.', time: '09:42', unread: 2, avatar: 'A' },
  { name: 'Customer Support', message: 'How can we help you today?', time: '09:18', unread: 0, avatar: 'CS' },
  { name: 'Project Team', message: 'The latest update is ready.', time: 'Yesterday', unread: 4, avatar: 'PT' },
  { name: 'Marketing', message: 'New campaign assets are available.', time: 'Yesterday', unread: 0, avatar: 'M' },
  { name: 'Family', message: 'See you later.', time: 'Monday', unread: 0, avatar: 'F' },
];

function Header({ onMenu }) {
  return (
    <Navbar
      title="WhatsApp"
      titleLarge
      className="shrink-0"
      right={
        <div className="flex items-center gap-1">
          <button className="rounded-full px-3 py-2 text-xl" aria-label="Search">⌕</button>
          <button className="rounded-full px-3 py-2 text-xl" aria-label="More options" onClick={onMenu}>⋮</button>
        </div>
      }
    />
  );
}

function Main() {
  const [query, setQuery] = useState('');
  const filteredChats = chats.filter((chat) =>
    `${chat.name} ${chat.message}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-white">
      <Block className="mb-0 px-4 pt-2 pb-1">
        <Searchbar
          value={query}
          onInput={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search chats"
        />
      </Block>

      <List className="m-0" dividers={false}>
        {filteredChats.map((chat) => (
          <ListItem
            key={chat.name}
            className="min-h-[72px] px-4"
            media={
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                {chat.avatar}
              </div>
            }
            title={chat.name}
            subtitle={
              <span className="block max-w-[250px] truncate text-gray-500">{chat.message}</span>
            }
            after={
              <div className="flex min-w-[46px] flex-col items-end gap-1">
                <span className="text-xs text-gray-400">{chat.time}</span>
                {chat.unread > 0 && <Badge colors={{ bg: 'bg-emerald-500' }}>{chat.unread}</Badge>}
              </div>
            }
          />
        ))}
      </List>
    </main>
  );
}

function BottomNav() {
  return (
    <Tabbar labels className="shrink-0">
      <ToolbarPane>
        <TabbarLink active icon={<span className="text-xl">◉</span>} label="Chats" />
        <TabbarLink icon={<span className="text-xl">◌</span>} label="Updates" />
        <TabbarLink icon={<span className="text-xl">⌘</span>} label="Communities" />
        <TabbarLink icon={<span className="text-xl">☎</span>} label="Calls" />
      </ToolbarPane>
    </Tabbar>
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
