import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../store/userSlice'
import productReducer from '../store/productSlice'
import cartReducer from '../store/cartSlice'
import addressReducer from '../store/addressSlice'

export const store = configureStore({
  reducer: {
    user : userReducer,
    product : productReducer,
    cart : cartReducer,
    address : addressReducer,
  },
})
