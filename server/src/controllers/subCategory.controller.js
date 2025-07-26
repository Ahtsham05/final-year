import { subCategory } from '../models/subCategory.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiResponse } from '../utils/apiResponse.js'
import { apiError } from '../utils/apiError.js'
import { Product } from '../models/product.model.js'

// create new sub category
const addSubCategory = asyncHandler(async (req,res)=>{
    try {
        const { name , image , category } = req.body
        if(!name || !image || !category[0]) return res.status(404).json(
            new apiResponse(404,"All Fields are Required!")
        )

        const save = await subCategory.create({
            name,
            image,
            category
        })
        if(!save) return res.status(401,"Sub Category Created Failed!")
        
        return res.status(200).json(
            new apiResponse(200,"Sub Category Created Successfully!",save)
        )
    } catch (error) {
        throw new apiError(500,"Error creating category",error)
    }
})

// get all sub categories with their associated category
const getAllSubCategory = asyncHandler(async (req,res)=>{
    try {
        const categories = await subCategory.find().sort({ createdAt : -1 }).populate("category")
        if(!categories){
            return res.status(404).json(
                new apiResponse(404,"No Categories Found!")
            )
        }

        return res.status(200).json(
            new apiResponse(200,"Categories Fetched Successfully!",categories)
        )
    } catch (error) {
        res.status(500).json(
            new apiResponse(500,"Server Error : ",error)
        )
    }
})

// update sub category
const updateSubcategory = asyncHandler(async (req, res)=>{
    try {
        const { _id , name, image, category } = req.body
        if(!_id ||!name ||!image ||!category[0]) return res.status(404).json(
            new apiResponse(404,"All Fields are Required!")
        )

        const check = await subCategory.findById(_id)
        if(!check) return res.status(404).json(
            new apiResponse(404,"Sub Category Not Found!")
        )

        const update = await subCategory.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })
        if(!update) return res.status(401).json(
            new apiResponse(401,"Sub Category Updated Failed!")
        )

        return res.status(200).json(
            new apiResponse(200,"Sub Category Updated Successfully!",update)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"Server Error updating category",error)
        )
    }
})

const deleteSubCategory = asyncHandler(async (req,res)=>{
    try {
        const { _id } = req.body
        if(!_id) return res.status(404).json(
            new apiResponse(404,"Id is Required!")
        )

        const isUsed = await Product.find({subCategoryId:{
            "$in": [_id]
        }}).countDocuments()
        if(isUsed > 0) return res.status(401).json(
            new apiResponse(401,"Sub Category is used in Products!")
        )

        const check = await subCategory.findById(_id)
        if(!check) return res.status(404).json(
            new apiResponse(404,"Sub Category Not Found!")
        )

        const deleteCategory = await subCategory.findByIdAndDelete(_id)
        if(!deleteCategory) return res.status(401).json(
            new apiResponse(401,"Sub Category Deleted Failed!")
        )

        return res.status(200).json(
            new apiResponse(200,"Sub Category Deleted Successfully!",deleteCategory)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"Server Error deleting category",error)
        )
    }
})

export {addSubCategory,getAllSubCategory,updateSubcategory,deleteSubCategory}