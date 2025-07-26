import { Router } from 'express'
import { addToCart, deleteCartItem, getCartItems, updateCartItemQuantity } from '../controllers/cartProduct.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const cartProductRoute = Router()

cartProductRoute.post('/add',auth,addToCart)
cartProductRoute.get('/get',auth,getCartItems)
cartProductRoute.put('/update',auth,updateCartItemQuantity)
cartProductRoute.delete('/delete',auth,deleteCartItem)

export default cartProductRoute