import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null,
  supercash: 0,
  orders: [],
  wallet: {
    balance: 0,
    earned: 0,
    redeemed: 0,
  },
  isLoading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    setSupercash: (state, action) => {
      state.supercash = action.payload
    },
    setOrders: (state, action) => {
      state.orders = action.payload
    },
    setWallet: (state, action) => {
      state.wallet = action.payload
    },
    addSupercash: (state, action) => {
      state.supercash += action.payload
      state.wallet.balance += action.payload
      state.wallet.earned += action.payload
    },
    redeemSupercash: (state, action) => {
      state.supercash -= action.payload
      state.wallet.balance -= action.payload
      state.wallet.redeemed += action.payload
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
  setProfile,
  setSupercash,
  setOrders,
  setWallet,
  addSupercash,
  redeemSupercash,
  setLoading,
  setError,
} = userSlice.actions

export default userSlice.reducer
