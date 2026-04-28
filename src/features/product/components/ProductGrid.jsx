import { Alert } from 'antd'
import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <Alert
        type="info"
        showIcon
        message="No products found"
        description="Try adjusting your search terms, category, or price range to explore more of the catalog."
      />
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
