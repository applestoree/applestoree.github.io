import { useEffect, useState } from 'react'
import { getProducts, type Product } from './services/products'

function App() {
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
    <main>
      <h1>Apple Store Malaysia</h1>
      <p>Apple The Exchange TRX</p>

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <section>
          {products.map(({ card }) => (
            <article key={card.item_group_id}>
              <h2>{card.title}</h2>
              {card.image_link && <img src={card.image_link} alt={card.title} />}
              <p>
                {card.sale_price ?? card.price ?? 'Price unavailable'}
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default App
