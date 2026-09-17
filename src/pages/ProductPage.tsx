import { SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getProducts, type Product } from '../services/products'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Empty } from '../components/ui/empty'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/select'
import { Skeleton } from '../components/ui/skeleton'

function formatPrice(value: number | null) {
  if (value === null) return 'Price unavailable'
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    maximumFractionDigits: 2,
  }).format(value)
}

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [productType, setProductType] = useState('all')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Unable to retrieve products.'))
      .finally(() => setLoading(false))
  }, [])

  const productTypes = useMemo(
    () => Array.from(new Set(products.map(({ card }) => card.product_type).filter((value): value is string => Boolean(value)))),
    [products],
  )

  const filteredProducts = productType === 'all'
    ? products
    : products.filter(({ card }) => card.product_type === productType)

  return (
    <section className="space-y-5 px-4 py-5 pb-8">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Collection</p>
        <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">Browse Apple Store Malaysia products.</p>
      </div>

      {!loading && !error && products.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Filter by type</p>
          <Select value={productType} onValueChange={setProductType}>
            <SelectTrigger aria-label="Filter products by type" className="h-11 rounded-xl bg-secondary/70 shadow-none">
              <SlidersHorizontal aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <span>{productType === 'all' ? 'All products' : productType}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              {productTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden rounded-2xl py-0 shadow-none">
              <Skeleton className="aspect-square rounded-none" />
              <CardContent className="space-y-2.5 p-3.5"><Skeleton className="h-4 w-2/5" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-5 w-3/5" /></CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && <Empty className="rounded-2xl border bg-secondary/50 py-10"><p className="text-sm text-muted-foreground">{error}</p></Empty>}
      {!loading && !error && products.length === 0 && <Empty className="rounded-2xl border bg-secondary/50 py-10"><p className="text-sm text-muted-foreground">No products available.</p></Empty>}
      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && <Empty className="rounded-2xl border bg-secondary/50 py-10"><p className="text-sm text-muted-foreground">No products match this filter.</p></Empty>}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(({ card }) => (
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
                <h2 className="line-clamp-2 min-h-10 text-sm font-medium leading-5">{card.title}</h2>
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
  )
}

export default ProductPage
