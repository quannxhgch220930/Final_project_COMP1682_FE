import { useEffect, useState } from 'react'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { handleApiError } from '../../../shared/utils/handleApiError'
import {
  categoryApi,
  collectCategoryAndDescendantIds,
  flattenCategories,
} from '../api/category.api'
import { productApi } from '../api/product.api'

export function useProducts() {
  const [categories, setCategories] = useState([])
  const [categoryTree, setCategoryTree] = useState([])
  const [filters, setFilters] = useState({
    maxPrice: '',
    minPrice: '',
    minRating: '',
    sort: 'newest',
  })
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    let mounted = true

    categoryApi
      .getList()
      .then((response) => {
        if (mounted) {
          setCategoryTree(response)
          setCategories(flattenCategories(response))
        }
      })
      .catch(() => {})

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function loadProducts() {
      setIsLoading(true)

      try {
        const selectedCategory = categories.find(
          (category) => category.id === selectedCategoryId,
        )
        const categoryIds = selectedCategoryId
          ? collectCategoryAndDescendantIds(
              categoryTree.find((category) => category.id === selectedCategoryId) ||
                selectedCategory,
            )
          : []

        const responses = categoryIds.length > 0
          ? await Promise.all(
              categoryIds.map((categoryId) =>
                productApi.getList({
                  categoryId,
                  maxPrice: filters.maxPrice,
                  minPrice: filters.minPrice,
                  minRating: filters.minRating,
                  search: debouncedSearchTerm,
                  sort: filters.sort,
                }),
              ),
            )
          : [
              await productApi.getList({
                maxPrice: filters.maxPrice,
                minPrice: filters.minPrice,
                minRating: filters.minRating,
                search: debouncedSearchTerm,
                sort: filters.sort,
              }),
            ]

        if (!mounted) {
          return
        }

        const mergedProducts = Array.from(
          new Map(
            responses
              .flatMap((response) => response.items)
              .map((product) => [product.id, product]),
          ).values(),
        )

        setProducts(mergedProducts)
        setErrorMessage('')
      } catch (error) {
        if (!mounted) {
          return
        }

        setErrorMessage(handleApiError(error))
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      mounted = false
    }
  }, [categories, categoryTree, debouncedSearchTerm, filters, selectedCategoryId])

  return {
    categories,
    errorMessage,
    filters,
    isLoading,
    products,
    searchTerm,
    selectedCategoryId,
    setFilters,
    setSearchTerm,
    setSelectedCategoryId,
  }
}
