import { useCallback, useEffect, useMemo, useState } from 'react'
import ProductTable from '../components/ProductTable'
import { adminProductApi } from '../api/adminProduct.api'
import { handleApiError } from '../../../../shared/utils/handleApiError'
import Button from '../../../../shared/ui/Button'
import Input from '../../../../shared/ui/Input'

function createInitialFormValues() {
  return {
    categoryId: '',
    description: '',
    name: '',
    price: '',
    slug: '',
    stock: '0',
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function validateProduct(values) {
  const errors = {}

  if (!values.name.trim()) {
    errors.name = 'Product name is required'
  }

  if (!values.slug.trim()) {
    errors.slug = 'Slug is required'
  }

  if (!values.price || Number(values.price) <= 0) {
    errors.price = 'Price must be greater than 0'
  }

  if (values.stock === '' || Number(values.stock) < 0) {
    errors.stock = 'Stock cannot be negative'
  }

  if (!values.categoryId) {
    errors.categoryId = 'Category is required'
  }

  return errors
}

function AdminProductsPage() {
  const [actionProductId, setActionProductId] = useState(null)
  const [categories, setCategories] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [formValues, setFormValues] = useState(createInitialFormValues)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pageState, setPageState] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  })
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const formTitle = useMemo(
    () => (selectedProduct ? 'Edit product' : 'Create product'),
    [selectedProduct],
  )

  const loadProducts = useCallback(
    async (page = pageState.page) => {
      setIsLoading(true)

      try {
        const response = await adminProductApi.getList({
          page,
          size: pageState.size,
        })

        setProducts(response.items)
        setPageState({
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        })
        setErrorMessage('')
      } catch (error) {
        setErrorMessage(handleApiError(error))
      } finally {
        setIsLoading(false)
      }
    },
    [pageState.page, pageState.size],
  )

  useEffect(() => {
    loadProducts(0)

    adminProductApi
      .getCategories()
      .then((response) => {
        setCategories(response)
      })
      .catch((error) => {
        setErrorMessage(handleApiError(error))
      })
  }, [loadProducts])

  const closeForm = () => {
    setFormErrors({})
    setFormValues(createInitialFormValues())
    setIsFormOpen(false)
    setSelectedProduct(null)
  }

  const openCreateForm = () => {
    setFormErrors({})
    setFormValues(createInitialFormValues())
    setIsFormOpen(true)
    setSelectedProduct(null)
  }

  const openEditForm = (product) => {
    setFormErrors({})
    setFormValues({
      categoryId: product.categoryId || '',
      description: product.description || '',
      name: product.name || '',
      price: String(product.price ?? ''),
      slug: product.slug || '',
      stock: String(product.stock ?? 0),
    })
    setIsFormOpen(true)
    setSelectedProduct(product)
  }

  const handleDelete = async (product) => {
    const confirmed = window.confirm(`Delete product ${product.name}?`)

    if (!confirmed) {
      return
    }

    setActionProductId(product.id)

    adminProductApi
      .deleteProduct(product.id)
      .then(async () => {
        const nextPage =
          products.length === 1 && pageState.page > 0
            ? pageState.page - 1
            : pageState.page
        await loadProducts(nextPage)
        setErrorMessage('')
      })
      .catch((error) => {
        setErrorMessage(handleApiError(error))
      })
      .finally(() => {
        setActionProductId(null)
      })
  }

  const handleFormChange = (field) => (event) => {
    const value = event.target.value

    setFormValues((current) => {
      const nextValues = {
        ...current,
        [field]: value,
      }

      if (field === 'name' && !selectedProduct) {
        nextValues.slug = slugify(value)
      }

      return nextValues
    })

    setFormErrors((current) => ({
      ...current,
      [field]: '',
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = validateProduct(formValues)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      if (selectedProduct) {
        await adminProductApi.updateProduct(selectedProduct.id, formValues)
      } else {
        await adminProductApi.createProduct(formValues)
      }

      await loadProducts(selectedProduct ? pageState.page : 0)
      setErrorMessage('')
      closeForm()
    } catch (error) {
      setErrorMessage(handleApiError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid gap-5">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/70">
            Product Management
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
            Admin products
          </h2>
          <p className="mt-2 text-sm text-stone-300">
            Manage product records with backend `/products` create, update, delete,
            and list endpoints.
          </p>
          <p className="mt-1 text-sm text-stone-400">
            {pageState.totalElements} products total, page {pageState.page + 1} /{' '}
            {Math.max(pageState.totalPages, 1)}
          </p>
        </div>

        <Button
          type="button"
          className="bg-[linear-gradient(135deg,#d6a85f_0%,#b8753a_100%)] text-stone-950 hover:bg-[linear-gradient(135deg,#dfb66f_0%,#c78346_100%)]"
          onClick={openCreateForm}
        >
          Create product
        </Button>
      </div>

      {isFormOpen ? (
        <form
          className="grid gap-4 rounded-[24px] border border-amber-200/15 bg-[rgba(25,19,14,0.9)] p-5 shadow-[0_22px_60px_rgba(10,8,5,0.32)]"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/70">
              {formTitle}
            </p>
            <h3 className="text-2xl font-semibold text-stone-50">
              {selectedProduct ? selectedProduct.name : 'New product'}
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-amber-50" htmlFor="admin-product-name">
                Name
              </label>
              <Input
                id="admin-product-name"
                className="border-amber-200/15 bg-[rgba(19,15,11,0.94)] text-amber-50 placeholder:text-stone-500 focus:border-amber-300/45 focus:ring-amber-200/10"
                value={formValues.name}
                onChange={handleFormChange('name')}
                placeholder="Product name"
              />
              {formErrors.name ? <p className="text-sm text-rose-300">{formErrors.name}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-amber-50" htmlFor="admin-product-slug">
                Slug
              </label>
              <Input
                id="admin-product-slug"
                className="border-amber-200/15 bg-[rgba(19,15,11,0.94)] text-amber-50 placeholder:text-stone-500 focus:border-amber-300/45 focus:ring-amber-200/10"
                value={formValues.slug}
                onChange={handleFormChange('slug')}
                placeholder="product-slug"
              />
              {formErrors.slug ? <p className="text-sm text-rose-300">{formErrors.slug}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-amber-50" htmlFor="admin-product-price">
                Price
              </label>
              <Input
                id="admin-product-price"
                className="border-amber-200/15 bg-[rgba(19,15,11,0.94)] text-amber-50 placeholder:text-stone-500 focus:border-amber-300/45 focus:ring-amber-200/10"
                min="0"
                type="number"
                value={formValues.price}
                onChange={handleFormChange('price')}
                placeholder="0"
              />
              {formErrors.price ? <p className="text-sm text-rose-300">{formErrors.price}</p> : null}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-amber-50" htmlFor="admin-product-stock">
                Stock
              </label>
              <Input
                id="admin-product-stock"
                className="border-amber-200/15 bg-[rgba(19,15,11,0.94)] text-amber-50 placeholder:text-stone-500 focus:border-amber-300/45 focus:ring-amber-200/10"
                min="0"
                type="number"
                value={formValues.stock}
                onChange={handleFormChange('stock')}
                placeholder="0"
              />
              {formErrors.stock ? <p className="text-sm text-rose-300">{formErrors.stock}</p> : null}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label className="text-sm font-medium text-amber-50" htmlFor="admin-product-category">
                Category
              </label>
              <select
                id="admin-product-category"
                className="w-full rounded-xl border border-amber-200/15 bg-[rgba(19,15,11,0.94)] px-3.5 py-3 text-amber-50 outline-none transition focus:border-amber-300/45 focus:ring-2 focus:ring-amber-200/10"
                value={formValues.categoryId}
                onChange={handleFormChange('categoryId')}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {`${'-- '.repeat(category.depth)}${category.name}`}
                  </option>
                ))}
              </select>
              {formErrors.categoryId ? (
                <p className="text-sm text-rose-300">{formErrors.categoryId}</p>
              ) : null}
            </div>

            <div className="grid gap-2 md:col-span-2">
              <label
                className="text-sm font-medium text-amber-50"
                htmlFor="admin-product-description"
              >
                Description
              </label>
              <textarea
                id="admin-product-description"
                className="min-h-32 rounded-xl border border-amber-200/15 bg-[rgba(19,15,11,0.94)] px-3.5 py-3 text-amber-50 outline-none transition focus:border-amber-300/45 focus:ring-2 focus:ring-amber-200/10"
                value={formValues.description}
                onChange={handleFormChange('description')}
                placeholder="Product description"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : selectedProduct ? 'Update product' : 'Create product'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeForm}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}

      {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
      {isLoading ? <p className="text-sm text-stone-300">Loading products...</p> : null}
      <ProductTable
        actionProductId={actionProductId}
        onDelete={handleDelete}
        onEdit={openEditForm}
        products={products}
      />

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
          disabled={isLoading || pageState.page === 0}
          onClick={() => loadProducts(pageState.page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="border-amber-200/15 bg-amber-200/8 text-stone-100 hover:bg-amber-200/14"
          disabled={
            isLoading || pageState.page >= Math.max(pageState.totalPages - 1, 0)
          }
          onClick={() => loadProducts(pageState.page + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}

export default AdminProductsPage
