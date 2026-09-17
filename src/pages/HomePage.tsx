import { useEffect, useState } from 'react'
import { getProducts, type Product } from '../services/products'
import FlashSale from '../components/FlashSale'

function HomePage() {
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
      <section>
        <h1>Apple Store Malaysia</h1>
        <p>Apple The Exchange TRX</p>
      </section>

      {!loading && !error && <FlashSale products={products} />}

      <section>
        <h2>Products</h2>
        {loading && <p>Loading products...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div>
            {products.map(({ card }) => (
              <article key={card.item_group_id}>
                <h3>{card.title}</h3>
                {card.image_link && <img src={card.image_link} alt={card.title} />}
                <p>{card.sale_price ?? card.price ?? 'Price unavailable'}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

export default HomePage
