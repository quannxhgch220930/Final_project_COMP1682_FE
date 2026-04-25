import { API_ENDPOINTS } from '../../../../shared/constants/api'
import { httpClient } from '../../../../shared/lib/axios'
import {
  categoryApi,
  flattenCategories,
} from '../../../product/api/category.api'
import { normalizeProductResponse } from '../../../product/utils/normalizeProductResponse'

function normalizeProductPayload(payload) {
  return {
    categoryId: Number(payload.categoryId),
    description: payload.description?.trim() || '',
    name: payload.name.trim(),
    price: Number(payload.price),
    slug: payload.slug.trim(),
    stock: Number(payload.stock),
  }
}

export const adminProductApi = {
  createProduct: async (payload) => {
    const response = await httpClient.post(
      API_ENDPOINTS.products.list,
      normalizeProductPayload(payload),
    )

    return {
      data: normalizeProductResponse(response?.data),
      message: response?.message || 'Product created successfully',
    }
  },
  deleteProduct: async (id) => {
    return httpClient.delete(API_ENDPOINTS.products.detail(id))
  },
  deleteProductImage: async (imageId) => {
    return httpClient.delete(API_ENDPOINTS.admin.removeProductImage(imageId))
  },
  getCategories: async () => {
    const categories = await categoryApi.getList()
    return flattenCategories(categories)
  },
  getList: async ({ page = 0, size = 20 } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort: 'newest',
    })
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
  updateProduct: async (id, payload) => {
    const response = await httpClient.put(
      API_ENDPOINTS.products.detail(id),
      normalizeProductPayload(payload),
    )

    return {
      data: normalizeProductResponse(response?.data),
      message: response?.message || 'Product updated successfully',
    }
  },
  updateProductImage: async (imageId, payload) => {
    const response = await httpClient.patch(
      API_ENDPOINTS.admin.updateProductImage(imageId),
      payload,
    )

    return {
      data: response?.data ?? null,
      message: response?.message || 'Product image updated successfully',
    }
  },
  uploadProductImage: async (id, payload) => {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('isPrimary', String(Boolean(payload.isPrimary)))
    formData.append('sortOrder', String(Number(payload.sortOrder ?? 0)))

    const response = await httpClient.postForm(
      API_ENDPOINTS.admin.productImages(id),
      formData,
    )

    return {
      data: response?.data ?? null,
      message: response?.message || 'Product image uploaded successfully',
    }
  },
}
