import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  filteredProducts: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {
    category: null,
    brand: null,
    minPrice: 0,
    maxPrice: 10000,
    search: '',
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
  },
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload.products
      state.pagination.total = action.payload.total
    },
    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
      state.pagination.page = 1
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        brand: null,
        minPrice: 0,
        maxPrice: 10000,
        search: '',
      }
      state.pagination.page = 1
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const {
  setProducts,
  setFilteredProducts,
  setSelectedProduct,
  setFilter,
  setPagination,
  clearFilters,
  setLoading,
  setError,
} = productSlice.actions

export default productSlice.reducer
