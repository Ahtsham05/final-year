import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    _id:'',
    name: '',
    email: '',
    mobile: '',
    avatar: '',
    status: '',
    verifyEmail: '',
    role:'',
    addressDetails:[],
    shopingCart:[],
    orderHistory: []
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserDetails : (state,action)=>{
            state._id = action.payload?._id;
            state.name = action.payload?.name;
            state.email = action.payload?.email;
            state.mobile = action.payload?.mobile;
            state.avatar = action.payload?.avatar;
            state.status = action.payload?.status;
            state.verifyEmail = action.payload?.verifyEmail;
            state.role = action.payload?.role;
            state.addressDetails = action.payload?.addressDetails;
            state.orderHistory = action.payload?.orderHistory;
            state.shopingCart = action.payload?.shoppingCart;
        },
        setUpdateUserAvatar: (state,action) =>{
            state.avatar = action.payload
        },
        setUpdateUserDetails: (state,action) => {
            state.name = action.payload?.name
            state.mobile = action.payload?.mobile
        },
        logout : (state,action)=>{
            state._id = ""
            state.name = ""
            state.email = ""
            state.mobile = ""
            state.avatar = ""
            state.status = ""
            state.verifyEmail = ""
            state.role = ""
            state.addressDetails = []
            state.orderHistory = []
            state.shopingCart = []
        }
    }
})

export const { setUserDetails , setUpdateUserAvatar ,logout , setUpdateUserDetails } = userSlice.actions
export default userSlice.reducer