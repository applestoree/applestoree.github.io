import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-between">
        <Link to="/home" className="flex min-w-0 items-center gap-2.5 rounded-md py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground"></span>
          <span className="truncate text-sm font-semibold tracking-tight">Apple Store Malaysia</span>
        </Link>
        <span className="text-[11px] font-medium text-muted-foreground">TRX</span>
      </div>
    </header>
  )
}

export default Header
