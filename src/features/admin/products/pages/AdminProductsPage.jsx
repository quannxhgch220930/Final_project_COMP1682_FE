import { useEffect, useState } from 'react'
import ProductTable from '../components/ProductTable'
import { adminProductApi } from '../api/adminProduct.api'

function AdminProductsPage() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    adminProductApi.getList().then(setProducts)
  }, [])

  return (
    <section className="stack">
      <div className="section-heading">
        <p className="eyebrow">Catalog Control</p>
        <h2>Admin products page scaffold</h2>
        <p className="muted">Table, API layer, and feature boundaries are in place.</p>
      </div>

      <ProductTable products={products} />
    </section>
  )
}

export default AdminProductsPage
