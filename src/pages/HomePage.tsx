import { useEffect, useState } from 'react'
import { getProducts, type Product } from '../services/products'
import FlashSale from '../components/FlashSale'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Empty } from '../components/ui/empty'
import { Skeleton } from '../components/ui/skeleton'

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
    <section className="space-y-5 p-4">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Apple Store Malaysia</h1>
        <p className="text-sm text-muted-foreground">Apple The Exchange TRX</p>
      </section>

      {!loading && !error && <FlashSale products={products} />}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Products</h2>
        {loading && (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <Skeleton className="aspect-square rounded-none" />
                <CardContent className="space-y-2"><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-2/5" /></CardContent>
              </Card>
            ))}
          </div>
        )}
        {error && <Empty><p className="text-sm text-muted-foreground">{error}</p></Empty>}
        {!loading && !error && products.length === 0 && <Empty><p className="text-sm text-muted-foreground">No products available.</p></Empty>}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {products.map(({ card }) => (
              <Card key={card.item_group_id} className="overflow-hidden">
                {card.image_link && <img src={card.image_link} alt={card.title} className="aspect-square w-full object-contain" loading="lazy" />}
                <CardContent className="space-y-2">
                  <Badge variant="secondary">{card.product_type ?? 'Product'}</Badge>
                  <h3 className="line-clamp-2 text-sm font-medium">{card.title}</h3>
                  <p className="text-sm font-semibold">{card.sale_price ?? card.price ?? 'Price unavailable'}</p>
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
