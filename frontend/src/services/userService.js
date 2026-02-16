import axiosClient from "../api/axiosClient"

export const userService = {
  // User Profile
  getProfile: () => axiosClient.get("/user/profile"),
  updateProfile: (data) => axiosClient.put("/user/profile", data),
  changePassword: (data) => axiosClient.post("/user/change-password", data),

  // Supercash/Wallet
  getSupercashBalance: () => axiosClient.get("/user/supercash/balance"),
  getSupercashTransactions: (filters = {}) =>
    axiosClient.get("/user/supercash/transactions", { params: filters }),
  getSupercashStats: () => axiosClient.get("/user/supercash/stats"),
  redeemSupercash: (data) =>
    axiosClient.post("/user/supercash/redeem", data),

  // Orders
  getUserOrders: (page = 1, limit = 10) =>
    axiosClient.get("/user/orders", { params: { page, limit } }),
  getOrderDetails: (orderId) => axiosClient.get(`/user/orders/${orderId}`),
  cancelOrder: (orderId) =>
    axiosClient.post(`/user/orders/${orderId}/cancel`),
  returnOrder: (orderId, data) =>
    axiosClient.post(`/user/orders/${orderId}/return`, data),

  // Addresses (optional for future)
  getSavedAddresses: () => axiosClient.get("/user/addresses"),
  addAddress: (data) => axiosClient.post("/user/addresses", data),
  updateAddress: (addressId, data) =>
    axiosClient.put(`/user/addresses/${addressId}`, data),
  deleteAddress: (addressId) =>
    axiosClient.delete(`/user/addresses/${addressId}`),

  // Wishlist (optional for future)
  getWishlist: () => axiosClient.get("/user/wishlist"),
  addToWishlist: (productId) =>
    axiosClient.post("/user/wishlist", { productId }),
  removeFromWishlist: (productId) =>
    axiosClient.delete(`/user/wishlist/${productId}`),

  // Reviews (optional for future)
  getUserReviews: () => axiosClient.get("/user/reviews"),
  addReview: (data) => axiosClient.post("/user/reviews", data),
  updateReview: (reviewId, data) =>
    axiosClient.put(`/user/reviews/${reviewId}`, data),
  deleteReview: (reviewId) => axiosClient.delete(`/user/reviews/${reviewId}`),

  // Referrals (optional for future)
  getReferralData: () => axiosClient.get("/user/referrals"),
  getReferralCode: () => axiosClient.get("/user/referrals/code"),
  shareReferral: (data) => axiosClient.post("/user/referrals/share", data),
}
