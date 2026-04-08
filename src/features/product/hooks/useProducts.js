import { useEffect, useState } from 'react'
import { productApi } from '../api/product.api'

export function useProducts() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    productApi.getList().then(setProducts)
  }, [])

  return {
    products,
  }
}
