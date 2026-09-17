import { useEffect, useState } from 'react'
import { getProducts, type Product } from '../services/products'
import FlashSale from '../components/FlashSale'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Empty } from '../components/ui/empty'
import { Skeleton } from '../components/ui/skeleton'

function formatPrice(value: number | null) {
  if (value === null) return 'Price unavailable'
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 2,
  }).format(value)
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to retrieve products.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="space-y-7 px-4 py-5 pb-8">
      <section className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Apple Store Malaysia</p>
        <h1 className="text-3xl font-semibold tracking-tight">Shop Apple.</h1>
        <p className="text-sm text-muted-foreground">Apple The Exchange TRX</p>
      </section>

      {!loading && !error && <FlashSale products={products} />}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Collection</p>
            <h2 className="text-xl font-semibold tracking-tight">Products</h2>
          </div>
          {!loading && !error && products.length > 0 && <span className="text-xs text-muted-foreground">{products.length} items</span>}
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden rounded-2xl py-0 shadow-none">
                <Skeleton className="aspect-square rounded-none" />
                <CardContent className="space-y-2.5 p-3.5">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-5 w-3/5" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && <Empty className="rounded-2xl border bg-secondary/50 py-10"><p className="text-sm text-muted-foreground">{error}</p></Empty>}
        {!loading && !error && products.length === 0 && <Empty className="rounded-2xl border bg-secondary/50 py-10"><p className="text-sm text-muted-foreground">No products available.</p></Empty>}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {products.map(({ card }) => (
              <Card key={card.item_group_id} className="overflow-hidden rounded-2xl border bg-card py-0 shadow-none transition-shadow hover:shadow-sm">
                <div className="relative aspect-square overflow-hidden bg-secondary/60">
                  {card.image_link ? (
                    <img src={card.image_link} alt={card.title} className="h-full w-full object-contain p-2.5" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Image unavailable</div>
                  )}
                  {card.custom_label_0 && <Badge className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px]">{card.custom_label_0}</Badge>}
                </div>
                <CardContent className="space-y-2 p-3.5">
                  <Badge variant="secondary" className="max-w-full rounded-full text-[10px] font-medium">{card.product_type ?? 'Product'}</Badge>
                  <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5">{card.title}</h3>
                  <p className="text-base font-semibold tracking-tight">{formatPrice(card.sale_price ?? card.price)}</p>
                  {card.sale_price !== null && card.price !== null && card.sale_price < card.price && (
                    <p className="text-xs text-muted-foreground line-through">{formatPrice(card.price)}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

export default HomePage
