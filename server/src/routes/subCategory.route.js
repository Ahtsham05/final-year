import { Router } from 'express'
import { addSubCategory,deleteSubCategory,getAllSubCategory,updateSubcategory } from '../controllers/subCategory.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const subCategoryRoute = Router()

// Add SubCategory
subCategoryRoute.post('/add',auth,addSubCategory)
subCategoryRoute.get('/get',getAllSubCategory)
subCategoryRoute.put('/update',auth,updateSubcategory)
subCategoryRoute.delete('/delete',deleteSubCategory)

export default subCategoryRoute