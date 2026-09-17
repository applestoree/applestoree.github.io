import { useEffect, useMemo, useState } from 'react'
import { getProducts, type Product } from '../services/products'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Empty } from '../components/ui/empty'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/select'
import { Skeleton } from '../components/ui/skeleton'

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
    <section className="space-y-4 p-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">Browse Apple Store Malaysia products.</p>
      </div>

      {!loading && !error && products.length > 0 && (
        <Select value={productType} onValueChange={setProductType}>
          <SelectTrigger aria-label="Filter products by type">
            <SelectContent>
              <SelectItem value="all">All products</SelectItem>
              {productTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </SelectContent>
          </SelectTrigger>
        </Select>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <Skeleton className="aspect-square rounded-none" />
              <CardContent className="space-y-2"><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-2/5" /></CardContent>
            </Card>
          ))}
        </div>
      )}
      {error && <Empty><p className="text-sm text-muted-foreground">{error}</p></Empty>}
      {!loading && !error && products.length === 0 && <Empty><p className="text-sm text-muted-foreground">No products available.</p></Empty>}
      {!loading && !error && products.length > 0 && filteredProducts.length === 0 && <Empty><p className="text-sm text-muted-foreground">No products match this filter.</p></Empty>}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map(({ card }) => (
            <Card key={card.item_group_id} className="overflow-hidden">
              {card.image_link && <img src={card.image_link} alt={card.title} className="aspect-square w-full object-contain" loading="lazy" />}
              <CardContent className="space-y-2">
                <Badge variant={card.custom_label_0 ? 'default' : 'secondary'}>{card.custom_label_0 ?? card.product_type ?? 'Product'}</Badge>
                <h2 className="line-clamp-2 text-sm font-medium">{card.title}</h2>
                <p className="text-sm font-semibold">{card.sale_price ?? card.price ?? 'Price unavailable'}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductPage
