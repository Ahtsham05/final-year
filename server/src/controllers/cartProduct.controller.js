import { cartProduct } from '../models/cartProduct.model.js'
import { User } from '../models/user.model.js'
import { apiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const addToCart = asyncHandler(async(req,res)=>{
    try {
        const userId = req.user?._id
        if(!userId)return res.status(404).json(
            new apiResponse(404,"Unauthorized Access!")
        )
        
        const {productId, quantity} = req.body

        if(!productId ||!quantity) return res.status(400).json(
            new apiResponse(400,"All Fields Are Required!")
        )

        const alreadyExisted = await cartProduct.find({userId, productId})
        if(alreadyExisted[0]) return res.status(400).json(
            new apiResponse(400,"Items Already Existed!")
        )

        const addingProduct = await cartProduct.create({
            userId : userId,
            productId : productId,
            quantity : quantity
        })

        if(!addingProduct) return res.status(404).json(
            new apiResponse(404,"Cart Creating error!")
        )

        const updateUser = await User.updateOne({_id:userId}, {
            $push:{
                shoppingCart : productId
            }
        })
        if(!updateUser) return res.status(404).json(
            new apiResponse(404,"User updating error!")
        )

        return res.status(200).json(
            new apiResponse(200,"Item Added!",addingProduct)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"server error adding to cart",error)
        )
    }
})

const getCartItems = asyncHandler(async(req,res)=>{
    try {
        const userId = req.user?._id
        if(!userId) return res.status(404).json(
            new apiResponse(404,"Unauthorized Access!")
        )

        const cartItems = await cartProduct.find({userId}).populate('productId')

        return res.status(200).json(
            new apiResponse(200,"Cart Items!",cartItems)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"server error getting cart items",error)
        )
    }
})

const updateCartItemQuantity = asyncHandler(async(req,res)=>{
    try {
        const {_id, quantity} = req.body
        if(!_id ||!quantity) return res.status(400).json(
            new apiResponse(400,"All Fields Are Required!")
        )

        const updateProduct = await cartProduct.updateOne({_id},{
            $set:{
                quantity
            }
        })
        if(!updateProduct) return res.status(404).json(
            new apiResponse(404,"Cart Item Not Found!")
        )

        return res.status(200).json(
            new apiResponse(200,"added item",updateProduct)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"Server Error updateCartItemQuantity",error)
        )
    }
})

const deleteCartItem = asyncHandler(async(req,res)=>{
    try {
        const userId = req.user?._id
        if(!userId) return res.status(404).json(
            new apiResponse(404,"Unauthorized Access!")
        )

        const {_id} = req.body
        if(!_id) return res.status(400).json(
            new apiResponse(400,"All Fields Are Required!")
        )
        const deleteProduct =await cartProduct.deleteOne({userId, _id})
        if(!deleteProduct) return res.status(404).json(
            new apiResponse(404,"Cart Item Not Found!")
        )

        return res.status(200).json(
            new apiResponse(200,"Item Removed!")
        )

    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"Server Error deleteCartItem",error)
        )
    }
})

export {addToCart,getCartItems,updateCartItemQuantity,deleteCartItem}