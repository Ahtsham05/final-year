import { Router} from 'express'
import {auth} from "../middlewares/auth.middleware.js"
import { createProduct, deleteProduct, getProductByCategory, getProductById, getProductBySubCategory, getProducts, searchProduct, updateProduct } from '../controllers/product.controller.js'

const productRoute = Router()

// Add routes for product here
productRoute.post('/add',auth,createProduct)
productRoute.post('/get',getProducts)
productRoute.post('/get-product-by-category',getProductByCategory)
productRoute.post('/get-product-by-subcategory',getProductBySubCategory)
productRoute.delete('/delete',auth,deleteProduct)
productRoute.put('/update',auth,updateProduct)
productRoute.post('/get-by-id',getProductById)
productRoute.post('/search',searchProduct)

export default productRoute