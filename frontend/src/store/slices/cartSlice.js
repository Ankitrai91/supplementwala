import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isLoading: false,
  error: null,
}

const normalize = (id) => (typeof id === "string" ? id : id?._id)

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload
      state.totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.variantId === action.payload.variantId)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => normalize(item.variantId) !== normalize(action.payload))
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => normalize(item.variantId) === normalize(action.payload.variantId))
      if (item) {
        item.quantity = action.payload.quantity
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalPrice = 0
      state.totalItems = 0
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setCartItems, addToCart, removeFromCart, updateQuantity, clearCart, setLoading, setError } = cartSlice.actions

export default cartSlice.reducer
