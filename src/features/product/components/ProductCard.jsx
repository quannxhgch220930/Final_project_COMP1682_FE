import { formatCurrency } from '../../../shared/utils/formatCurrency'

function ProductCard({ product }) {
  return (
    <article className="card stack">
      <div>
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
      </div>
      <strong>{formatCurrency(product.price)}</strong>
    </article>
  )
}

export default ProductCard
