const demoProducts = [
  { id: 'p1', name: 'Canvas Tote', price: 280000, category: 'Accessories' },
  { id: 'p2', name: 'Linen Shirt', price: 540000, category: 'Apparel' },
  { id: 'p3', name: 'Desk Lamp', price: 720000, category: 'Home' },
  { id: 'p4', name: 'Leather Wallet', price: 450000, category: 'Accessories' },
]

export const productApi = {
  getList: async () => demoProducts,
}
