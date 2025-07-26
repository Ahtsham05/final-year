import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allCategories:[],
    allSubCategories:[],
    allProducts:[],
    loadingState:true,
}
export const productSlice  = createSlice({
    name:"product",
    initialState,
    reducers:{
        setCategories:(state,action)=>{
            state.allCategories = [...action.payload]
        },
        setSubCategories:(state,action)=>{
            state.allSubCategories = [...action.payload]
        },
        setProducts:(state,action)=>{
            state.allProducts = [...action.payload]
        },
        setLoadingState:(state,action)=>{
            state.loadingState = action.payload
        }
    }
})

export const {setCategories,setSubCategories,setLoadingState} = productSlice.actions

export default productSlice.reducer