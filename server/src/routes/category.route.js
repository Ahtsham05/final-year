import { Router } from 'express'
import { auth } from "../middlewares/auth.middleware.js"
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller.js"

const categoryRoute = Router()

categoryRoute.post('/add-category',auth,createCategory)
categoryRoute.get('/get-category',getAllCategories)
categoryRoute.put('/update-category',auth,updateCategory)
categoryRoute.post('/delete-category',auth,deleteCategory)

export default categoryRoute