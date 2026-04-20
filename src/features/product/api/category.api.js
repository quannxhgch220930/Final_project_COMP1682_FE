import { API_ENDPOINTS } from '../../../shared/constants/api'
import { httpClient } from '../../../shared/lib/axios'

function normalizeCategory(category) {
  if (!category) {
    return null
  }

  return {
    ...category,
    children: (category.children || [])
      .map((child) => normalizeCategory(child))
      .filter(Boolean),
    id: String(category.id),
    name: category.name || 'Unnamed category',
    parentId: category.parentId ? String(category.parentId) : null,
  }
}

export function flattenCategories(categories, depth = 0) {
  return categories.flatMap((category) => [
    {
      ...category,
      depth,
    },
    ...flattenCategories(category.children || [], depth + 1),
  ])
}

export function collectCategoryAndDescendantIds(category) {
  if (!category) {
    return []
  }

  return [
    category.id,
    ...(category.children || []).flatMap((child) =>
      collectCategoryAndDescendantIds(child),
    ),
  ]
}

export const categoryApi = {
  getList: async () => {
    const response = await httpClient.get(API_ENDPOINTS.categories.list)
    const categories = response?.data || []

    return categories.map((category) => normalizeCategory(category))
  },
}
