import { House, ShoppingBag, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/home', label: 'Home', icon: House },
  { to: '/product', label: 'Products', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-30 border-t bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/80" aria-label="Primary navigation">
      <div className="grid grid-cols-3 gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'}`}
          >
            {({ isActive }) => {
              const Icon = item.icon
              return (
                <Icon
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={isActive ? 2.25 : 2}
                />
              )
            }}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
