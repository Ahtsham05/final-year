import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { Category } from '../models/category.model.js'
import { subCategory } from '../models/subCategory.model.js'
import { Product } from '../models/product.model.js'

// create category
const createCategory = asyncHandler(async(req,res)=>{
    try {
        const {name , image} = req.body
        if(!name || !image) return res.status(404).json(
            new apiResponse(404,"All Fields are required!")
        )

        const category = new Category({name, image})
        const newCategory = await category.save()
        if(!newCategory) return res.status(401).json(
            new apiResponse(401,"Failed to create category!")
        )

        return res.status(200).json(
            new apiResponse(200,"Category created Successfully!",newCategory)
        )
    } catch (error) {
        throw new apiError(500,"Error creating category",error)
    }
})

//get all categories 
const getAllCategories = asyncHandler(async(req,res)=>{
    try {
        const category  = await Category.find()
        
        return res.status(200).json(
            new apiResponse(200,"Categories fetched successfully!",category)
        )
    } catch (error) {
        throw new apiError(500,"Error Getting all categories",error)
    }
})

//update category
const updateCategory = asyncHandler(async (req,res)=>{
    try {
        const { _id , name , image} = req.body
        if(!_id || !name || !image) return res.status(404).json(
            new apiResponse(404,"All Fields are required!")
        )

        const category = await Category.findByIdAndUpdate(_id,{
            $set:{
                name,
                image
            }
        })
        if(!category) return res.status(401).json(
            new apiResponse(401,"Failed to update category!")
        )

        return res.status(200).json(
            new apiResponse(200,"Category updated Successfully!",category)
        )
    } catch (error) {
        throw new apiError(500,"Error updating category",error)
    }
})

//delete category
const deleteCategory = asyncHandler(async (req,res)=>{
    try {
        const { _id } = req.body
        if(!_id) return res.status(404).json(
            new apiResponse(404,"All Fields are required!")
        )


        const isUsed = await subCategory.find({category:{
            "$in": [_id]
        }}).countDocuments()
        const isUsedProduct = await Product.find({categoryId:{
            "$in":[_id]
        }}).countDocuments()
        if( isUsed > 0 || isUsedProduct > 0) return res.status(401).json(
            new apiResponse(401,"Can't Delete, Category is Used!")
        )

        const category = await Category.findByIdAndDelete(_id)
        if(!category) return res.status(401).json(
            new apiResponse(401,"Failed to delete category!")
        )

        return res.status(200).json(
            new apiResponse(200,"Successfully deleted category")
        )
    } catch (error) {
        throw new apiError(500,"Error deleting category",error)
    }
})

export {createCategory,getAllCategories,updateCategory,deleteCategory}