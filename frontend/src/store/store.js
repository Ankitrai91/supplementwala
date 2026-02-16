import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import productReducer from './slices/productSlice'
import userReducer from './slices/userSlice'



import {
  persistStore,
  persistReducer,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

const cartPersistConfig = {
  key: "cart",
  storage,
}

const persistedCartReducer = persistReducer(
  cartPersistConfig,
  cartReducer
)



export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: persistedCartReducer,
    product: productReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)