import {Address} from '../models/address.model.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const createAddress = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id
        if(!userId) return res.status(404).json(
            new apiResponse(404, "unAuthorized access!")
        )

        const {addressLine,city,state,pincode,country,mobile} = req.body
        if(!addressLine ||!city ||!state ||!pincode ||!country ||!mobile) return res.status(400).json(
            new apiResponse(400, "All Fields Are Required!")
        )

        const newAddress = new Address({
            addressLine,
            city,
            state,
            pincode,
            country,
            mobile,
            userId
        })
        const createdAddress = await newAddress.save()

        return res.status(200).json(
            new apiResponse(200, "Address Created Successfully!", createdAddress)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500, "Error in creating address", error)
        )
    }
})

const getAddress = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id
        if(!userId) return res.status(404).json(
            new apiResponse(404, "unauthorized access!")
        )

        const address = await Address.find({userId,status:true}).sort({createdAt: -1}).populate('userId')
        if(!address) return res.status(404).json(
            new apiResponse(404, "Address not found!")
        )

        return res.status(200).json(
            new apiResponse(200, "Address fetched successfully!", address)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500, "Error in getting address", error)
        )
    }
})

const updateAddress = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id
        if(!userId) return res.status(404).json(
            new apiResponse(404, "unauthorized access!")
        )

        const {_id,addressLine,city,state,pincode,country,mobile} = req.body
        if(!addressLine || !city || !state || !pincode || !country || !mobile) return res.status(400).json(
            new apiResponse(400, "All Fields Are Required!")
        )

        const address = await Address.findById(_id)
        if(!address) return res.status(404).json(
            new apiResponse(404, "Address not found!")
        )

        address.addressLine = addressLine
        address.city = city
        address.state = state
        address.pincode = pincode
        address.country = country
        address.mobile = mobile

        const updatedAddress = await address.save()

        return res.status(200).json(
            new apiResponse(200, "Address updated successfully!", updatedAddress)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500, "Error in updating address", error)
        )
    }
})

const disableAddress = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id
        if(!userId) return res.status(404).json(
            new apiResponse(404, "unauthorized access!")
        )

        const {_id} = req.body
        if(!_id) return res.status(400).json(
            new apiResponse(400, "Address Id is required!")
        )

        const address = await Address.findById(_id,userId)
        if(!address) return res.status(404).json(
            new apiResponse(404, "Address not found!")
        )

        address.status = false
        const updatedAddress = await address.save()

        return res.status(200).json(
            new apiResponse(200, "Address disabled successfully!", updatedAddress)
        )
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500, "Error in disabling address", error)
        )
    }
})

export { createAddress , getAddress , updateAddress , disableAddress }