import { useEffect, useState } from 'react'
import { getProducts, type Product } from '../services/products'

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Unable to retrieve products.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <h1>Products</h1>
      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div>
          {products.map(({ card }) => (
            <article key={card.item_group_id}>
              <h2>{card.title}</h2>
              {card.image_link && <img src={card.image_link} alt={card.title} />}
              <p>{card.sale_price ?? card.price ?? 'Price unavailable'}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductPage
