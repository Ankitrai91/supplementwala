import axiosClient from "../api/axiosClient"

export const productService = {
  getAllProducts: (params) => axiosClient.get("/products", { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
  getProductBySlug: (slug) => axiosClient.get(`/products/slug/${slug}`),
  getVariants: (productId) => axiosClient.get(`/products/${productId}/variants`),
  getRelatedProducts: (id) => axiosClient.get(`/products/related/${id}`),
  searchGlobal: (query) =>
    axiosClient.get("/search", {
      params: { q: query },
    }),
}

export const brandService = {
  getAllBrands: () => axiosClient.get("/brands"),
}

export const categoryService = {
  getAllCategories: (params) => axiosClient.get("/categories", { params }),
  getCategoryById: (id) => axiosClient.get(`/categories/${id}`),
  getCategoryWithSubs: (id) => axiosClient.get(`/categories/${id}/subcategories`),
}
