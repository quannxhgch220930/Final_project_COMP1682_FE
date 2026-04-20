import ProductCard from './ProductCard'

function ProductGrid({ products }) {
  if (products.length === 0) {
    return <p className="text-sm text-stone-500">No products found.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
