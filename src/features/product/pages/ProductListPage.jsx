import { Alert } from 'antd'
import ProductGrid from '../components/ProductGrid'
import { useProducts } from '../hooks/useProducts'
import { navigateTo } from '../../../shared/lib/navigation'
import { ROUTES } from '../../../shared/constants/routes'

function ProductListPage() {
  const {
    categories,
    errorMessage,
    filters,
    isLoading,
    products,
    searchTerm,
    selectedCategoryId,
  } = useProducts()
  const visibleCategories = categories.slice(0, 6)
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId)

  return (
    <section className="grid gap-8">
      <div className="grid overflow-hidden rounded-3xl border border-stone-300 bg-white shadow-[0_24px_70px_rgba(63,39,18,0.08)] lg:grid-cols-[minmax(0,1.1fr)_420px]">
        <div className="grid content-center gap-6 p-6 md:p-10">
          <div className="grid gap-3">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-amber-800">
              Online storefront
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-normal text-stone-950 md:text-6xl">
              Shop new arrivals and everyday essentials
            </h1>
            <p className="max-w-2xl text-base font-medium leading-7 text-stone-700">
              Browse curated products, save favorites, and checkout with your saved shipping details.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-stone-800"
              style={{ color: '#ffffff' }}
              onClick={() => navigateTo(ROUTES.products)}
            >
              Shop all
            </button>
            <button
              type="button"
              className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-900 transition hover:border-stone-950"
              onClick={() => navigateTo(ROUTES.filter)}
            >
              Filter products
            </button>
          </div>

          <div className="grid gap-3 border-t border-stone-300 pt-5 sm:grid-cols-3">
            <div>
              <strong className="text-2xl text-stone-950">{products.length}</strong>
              <p className="text-sm font-medium text-stone-700">Products visible</p>
            </div>
            <div>
              <strong className="text-2xl text-stone-950">{categories.length}</strong>
              <p className="text-sm font-medium text-stone-700">Categories</p>
            </div>
            <div>
              <strong className="text-2xl text-stone-950">Fast</strong>
              <p className="text-sm font-medium text-stone-700">Checkout flow</p>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px] bg-stone-950 p-6 text-white md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(245,158,11,0.28),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.22),transparent_28%)]" />
          <div className="relative grid h-full content-between gap-10">
            <div className="ml-auto w-fit rounded-full border border-white bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-stone-950">
              Featured picks
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                {products.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="overflow-hidden rounded-2xl border border-white bg-white text-left transition hover:brightness-95"
                    onClick={() => navigateTo(ROUTES.productDetail(product.id))}
                  >
                    {product.imageUrl ? (
                      <img className="aspect-square w-full object-cover" src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div className="grid aspect-square place-items-center bg-white px-3 text-center text-xs font-extrabold uppercase tracking-[0.14em] text-stone-950">
                        {product.category}
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm font-medium leading-6 text-white/90">
                Fresh inventory is updated from the catalog API and ready for cart, wishlist, and order flows.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-stone-300 bg-white p-4 shadow-[0_18px_45px_rgba(63,39,18,0.06)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-stone-700">
              {selectedCategory?.name || 'All departments'}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-normal text-stone-950">
              {searchTerm ? `Results for "${searchTerm}"` : 'Recommended products'}
            </h2>
          </div>
          <p className="text-sm font-medium text-stone-700">
            Sort: <span className="font-semibold text-stone-900">{filters.sort.replace('_', ' ')}</span>
          </p>
        </div>

        {visibleCategories.length > 0 ? (
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                selectedCategoryId
                  ? 'border-stone-300 bg-white text-stone-800'
                  : 'border-stone-950 bg-stone-950 text-white'
              }`}
              style={!selectedCategoryId ? { color: '#ffffff' } : undefined}
              onClick={() => navigateTo(ROUTES.products)}
            >
              All
            </button>
            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${
                  selectedCategoryId === category.id
                    ? 'border-stone-950 bg-stone-950 text-white'
                    : 'border-stone-300 bg-white text-stone-800 hover:border-stone-700'
                }`}
                style={selectedCategoryId === category.id ? { color: '#ffffff' } : undefined}
                onClick={() => navigateTo(`${ROUTES.products}?categoryId=${category.id}`)}
              >
                {category.name}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isLoading ? <Alert type="info" message="Loading products..." showIcon /> : null}
      {errorMessage ? <Alert type="error" message={errorMessage} showIcon /> : null}
      <ProductGrid products={products} />
    </section>
  )
}

export default ProductListPage
