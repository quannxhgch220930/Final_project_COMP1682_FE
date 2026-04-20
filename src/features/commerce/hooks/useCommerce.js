import { useCommerceContext } from '../contexts/CommerceStateContext'

export function useCommerce() {
  return useCommerceContext()
}
