import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {apiResponse } from "../utils/apiResponse.js"


const auth = async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token) return res.status(401).json(
            new apiResponse(401,"unauthorized Token Access!")
        )

        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        if(!decoded) return res.status(401).json(
            new apiResponse(401,"unauthorized Decoded Access!")
        )

        const user = await User.findOne({_id: decoded._id})
        if(!user) return res.status(401).json(
            new apiResponse(401,"unauthorized User Access!")
        )

        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json(
            new apiResponse(500,"Unauthorized access auth",error)
        )
    }
}

export {auth};