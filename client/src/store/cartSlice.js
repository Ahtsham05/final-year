import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems:[]
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCartStore:(state,action)=>{
            state.cartItems = [...action.payload]
        }
    }
})

export const { addToCartStore } = cartSlice.actions

export default cartSlice.reducer