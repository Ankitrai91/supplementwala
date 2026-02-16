import axiosClient from "../api/axiosClient"

export const cartService = {
  getCart: () => axiosClient.get("/cart"),
  addToCart: (data) => axiosClient.post("/cart/add", data),
  updateCartItem: (variantId, quantity) => axiosClient.patch(`/cart/${variantId}`, { quantity }),
  removeFromCart: (variantId) => axiosClient.delete(`/cart/${variantId}`),
  clearCart: () => axiosClient.delete("/cart"),
}

export const orderService = {
  getOrders: (page = 1, limit = 10) => axiosClient.get("/orders", { params: { page, limit } }),
  getOrderById: (id) => axiosClient.get(`/orders/${id}`),
  createOrder: (data) => axiosClient.post("/orders", data),
}
