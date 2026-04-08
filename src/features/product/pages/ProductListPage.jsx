import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'

function ProductListPage() {
  const { products } = useProducts()

  return (
    <section className="stack">
      <div className="section-heading">
        <p className="eyebrow">Product Feature</p>
        <h2>Product list page scaffold</h2>
        <p className="muted">
          This is a starter page wired through the new feature-first structure.
        </p>
      </div>

      <ProductGrid products={products} />
    </section>
  )
}

export default ProductListPage
