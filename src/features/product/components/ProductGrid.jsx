import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  return (
    <div className="card-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
