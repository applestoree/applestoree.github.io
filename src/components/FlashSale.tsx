import { useEffect, useState } from 'react'
import type { Product } from '../services/products'

type Countdown = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function getNextSunday(now: Date) {
  const nextSunday = new Date(now)
  nextSunday.setHours(0, 0, 0, 0)
  const daysUntilSunday = (7 - nextSunday.getDay()) % 7
  nextSunday.setDate(nextSunday.getDate() + (daysUntilSunday || 7))
  return nextSunday
}

function getCountdown(now: Date): Countdown {
  const nextSunday = getNextSunday(now)
  const currentSunday = new Date(nextSunday.getTime() - WEEK_MS)
  const remaining = Math.max(0, nextSunday.getTime() - now.getTime())

  if (now.getTime() < currentSunday.getTime()) {
    return { days: 7, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hours = Math.floor((remaining / (60 * 60 * 1000)) % 24)
  const minutes = Math.floor((remaining / (60 * 1000)) % 60)
  const seconds = Math.floor((remaining / 1000) % 60)

  return { days, hours, minutes, seconds }
}

function formatPrice(value: number | null) {
  if (value === null) return 'Price unavailable'
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 2,
  }).format(value)
}

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

function FlashSale({ products }: { products: Product[] }) {
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(new Date()))

  useEffect(() => {
    const updateCountdown = () => setCountdown(getCountdown(new Date()))
    const timer = window.setInterval(updateCountdown, 1000)
    updateCountdown()
    return () => window.clearInterval(timer)
  }, [])

  const flashSaleProducts = products.filter(({ card }) => Boolean(card.custom_label_0))

  if (flashSaleProducts.length === 0) return null

  return (
    <section className="-mx-4 space-y-3 border-y bg-secondary/45 px-4 py-5" aria-labelledby="flash-sale-heading">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 id="flash-sale-heading" className="text-lg font-semibold tracking-tight">Flash Sale</h2>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">Sale</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Limited-time offers</p>
        </div>
        <div className="shrink-0 rounded-xl bg-primary px-2.5 py-1.5 text-xs font-semibold tabular-nums text-primary-foreground" aria-label="Flash Sale countdown">
          {pad(countdown.days)}:{pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
        </div>
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {flashSaleProducts.map(({ card, productdetailpage }) => (
          <article key={card.item_group_id} className="w-40 shrink-0 overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-none">
            <div className="relative aspect-square bg-background">
              {card.image_link ? (
                <img src={card.image_link} alt={card.title} className="h-full w-full object-contain p-2" loading="lazy" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Image unavailable</div>
              )}
              <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground">Flash Sale</span>
            </div>
            <div className="space-y-1.5 p-3">
              <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5">{card.title}</h3>
              <p className="text-sm font-semibold">{formatPrice(card.sale_price ?? card.price)}</p>
              {card.sale_price !== null && card.price !== null && card.sale_price < card.price && (
                <p className="text-xs text-muted-foreground line-through">{formatPrice(card.price)}</p>
              )}
              <p className="truncate text-[11px] text-muted-foreground">{productdetailpage.availability ?? card.custom_label_0}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FlashSale
