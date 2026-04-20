import SearchBar from '../../../shared/components/SearchBar'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'

function ProductListPage() {
  const {
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
  } = useProducts()

  return (
    <section className="grid gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Product Feature
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Latest products
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Browse the catalog loaded from the backend product endpoint.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-stone-200 bg-white/85 p-4 shadow-[0_20px_45px_rgba(63,39,18,0.08)] backdrop-blur md:grid-cols-2 xl:grid-cols-3">
        <SearchBar
          className="md:col-span-2 xl:col-span-1"
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products by name..."
        />
        <select
          className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          value={selectedCategoryId}
          onChange={(event) => setSelectedCategoryId(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {`${'-- '.repeat(category.depth)}${category.name}`}
            </option>
          ))}
        </select>
        <select
          className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          value={filters.sort}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              sort: event.target.value,
            }))
          }
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
          <option value="rating_desc">Top rated</option>
        </select>
        <input
          className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          min="0"
          placeholder="Min price"
          type="number"
          value={filters.minPrice}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              minPrice: event.target.value,
            }))
          }
        />
        <input
          className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          min="0"
          placeholder="Max price"
          type="number"
          value={filters.maxPrice}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              maxPrice: event.target.value,
            }))
          }
        />
        <select
          className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
          value={filters.minRating}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              minRating: event.target.value,
            }))
          }
        >
          <option value="">Any rating</option>
          <option value="1">1+ stars</option>
          <option value="2">2+ stars</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>

      {isLoading ? <p className="text-sm text-stone-500">Loading products...</p> : null}
      {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
      <ProductGrid products={products} />
    </section>
  )
}

export default ProductListPage
