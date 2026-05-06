import { useState } from 'react'
import { Card, InputNumber, Select, Typography } from 'antd'
import Button from '../../../shared/ui/Button'
import { navigateTo } from '../../../shared/lib/navigation'
import { useProducts } from '../hooks/useProducts'
import { ROUTES } from '../../../shared/constants/routes'

const { Title } = Typography

function FilterPage() {
  const { categories, filters, selectedCategoryId } = useProducts()
  const [localSelectedCategoryId, setLocalSelectedCategoryId] = useState(selectedCategoryId)
  const [localFilters, setLocalFilters] = useState(filters)

  const clearFilters = () => {
    setLocalSelectedCategoryId('')
    setLocalFilters((current) => ({
      ...current,
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (localSelectedCategoryId) {
      params.set('categoryId', localSelectedCategoryId)
    }

    if (localFilters.sort) {
      params.set('sort', localFilters.sort)
    }

    if (localFilters.minPrice !== '') {
      params.set('minPrice', String(localFilters.minPrice))
    }

    if (localFilters.maxPrice !== '') {
      params.set('maxPrice', String(localFilters.maxPrice))
    }

    navigateTo(`${ROUTES.products}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <section className="grid gap-8">
      <Card className="grid gap-4 bg-[rgba(255,252,247,0.88)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-stone-700">
            Filters
          </p>
          <Title level={2} className="mt-2 text-stone-900">
            Refine catalog
          </Title>
        </div>

        <div className="grid gap-4">
          <Select
            value={localSelectedCategoryId}
            onChange={setLocalSelectedCategoryId}
            options={[
              { label: 'All categories', value: '' },
              ...categories.map((category) => ({
                label: `${'-- '.repeat(category.depth)}${category.name}`,
                value: category.id,
              })),
            ]}
          />

          <Select
            value={localFilters.sort}
            onChange={(value) =>
              setLocalFilters((current) => ({
                ...current,
                sort: value,
              }))
            }
            options={[
              { label: 'Newest arrivals', value: 'newest' },
              { label: 'Price: low to high', value: 'price_asc' },
              { label: 'Price: high to low', value: 'price_desc' },
              { label: 'Top rated', value: 'rating_desc' },
            ]}
          />

          <InputNumber
            className="w-full"
            style={{ width: '100%' }}
            size="large"
            min={0}
            placeholder="Minimum price"
            value={localFilters.minPrice}
            onChange={(value) =>
              setLocalFilters((current) => ({
                ...current,
                minPrice: value ?? '',
              }))
            }
          />

          <InputNumber
            className="w-full"
            style={{ width: '100%' }}
            size="large"
            min={0}
            placeholder="Maximum price"
            value={localFilters.maxPrice}
            onChange={(value) =>
              setLocalFilters((current) => ({
                ...current,
                maxPrice: value ?? '',
              }))
            }
          />

          <div className="flex gap-3">
            <Button type="button" className="flex-1" onClick={clearFilters}>
              Reset filters
            </Button>
            <Button type="button" variant="secondary" className="flex-1" onClick={handleApplyFilters}>
              Apply filters
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}

export default FilterPage
