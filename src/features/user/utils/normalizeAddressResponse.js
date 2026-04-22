export function normalizeAddressResponse(address) {
  return {
    district: address?.district || '',
    fullAddress: address?.fullAddress || '',
    id: String(address?.id || ''),
    province: address?.province || '',
    receiverName: address?.receiverName || '',
    receiverPhone: address?.receiverPhone || '',
    street: address?.street || '',
    ward: address?.ward || '',
  }
}
