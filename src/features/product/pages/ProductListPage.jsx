import { Alert } from 'antd'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'

function ProductListPage() {
  const {
    errorMessage,
    filters,
    isLoading,
    products,
  } = useProducts()

  return (
    <section className="grid gap-5">
      {isLoading ? <Alert type="info" message="Loading products..." showIcon /> : null}
      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
      <ProductGrid products={products} />
    </section>
  )
}

export default ProductListPage
