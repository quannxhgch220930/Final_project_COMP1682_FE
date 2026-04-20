import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'
import { normalizeProductResponse } from '../utils/normalizeProductResponse'

export const productApi = {
  getById: async (id) => {
    const response = await httpClient.get(API_ENDPOINTS.products.detail(id))
    return normalizeProductResponse(response?.data)
  },
  getList: async ({
    categoryId = '',
    maxPrice = '',
    minPrice = '',
    minRating = '',
    page = 0,
    search = '',
    size = 10,
    sort = 'newest',
  } = {}) => {
    const query = new URLSearchParams()
    query.set('page', String(page))
    query.set('size', String(size))
    query.set('sort', sort)

    if (categoryId) {
      query.set('categoryId', String(categoryId))
    }

    if (minPrice !== '') {
      query.set('minPrice', String(minPrice))
    }

    if (maxPrice !== '') {
      query.set('maxPrice', String(maxPrice))
    }

    if (minRating !== '') {
      query.set('minRating', String(minRating))
    }

    if (search.trim()) {
      query.set('search', search.trim())
    }

    const response = await httpClient.get(`${API_ENDPOINTS.products.list}?${query}`)
    const pageData = response?.data
    const products = pageData?.content || []

    return {
      items: products.map((product) => normalizeProductResponse(product)),
      page: pageData?.page ?? page,
      size: pageData?.size ?? size,
      totalElements: pageData?.totalElements ?? products.length,
      totalPages: pageData?.totalPages ?? 1,
    }
  },
}
