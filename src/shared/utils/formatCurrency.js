export function formatCurrency(value, currency = 'VND', locale = 'vi-VN') {
  return new Intl.NumberFormat(locale, {
    currency,
    style: 'currency',
  }).format(value)
}
