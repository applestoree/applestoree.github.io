import { NavLink } from 'react-router-dom'

const items = [
  { to: '/home', label: 'Home', icon: '⌂' },
  { to: '/product', label: 'Products', icon: '▦' },
  { to: '/profile', label: 'Profile', icon: '○' },
]

function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 border-t bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/80" aria-label="Primary navigation">
      <div className="grid grid-cols-3 gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-medium transition-colors ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'}`}
          >
            {({ isActive }) => (
              <>
                <span aria-hidden="true" className={`text-lg leading-none ${isActive ? 'font-semibold' : ''}`}>{item.icon}</span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
