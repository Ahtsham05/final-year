import { User } from "../models/user.model.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendMail } from '../utils/sendmail.js'
import { generateOTP } from "../utils/generateOTP.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken= async(userId)=>{
    const user = await User.findOne({_id:userId})
    if(!user){
        throw new apiError(404,"user not found for generate Tokens")
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken= await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken , refreshToken}
}

const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,mobile} = req.body

    if([name,email,password].some(value => value?.trim() === "")){
        return res.status(404).json(
            new apiResponse(404,"All fields are required")
        )
    }

    // check if email is existed or not 
    const existedUser = await User.findOne({email})

    if(existedUser){
        return res.status(409).json(
            new apiResponse(409,"User is Already Exists")
        ) 
    }

    let avatarLocalPath;

    if(req.file){
     avatarLocalPath = req.file?.path;
    }

    const uploadAvatar = await uploadOnCloudinary(avatarLocalPath)
    
    const saveUser = await User.create({
        name,
        email,
        password,
        mobile,
        avatar:uploadAvatar?.url || ""
    })

    const createdUser = await User.findOne(saveUser._id).select(
        "-password"
    )

    if(!createdUser){
        return res.status(409).json(
            new apiResponse(409,"Error during Registration")
        )
    }

    const url = `http://localhost:${process.env.PORT}/verify-email?code=${createdUser._id}`;

    const sendmail = await sendMail(email, "Verification Email" , `
        <p>Dear ${name}!</p>
        <p>
        Thanks for Registering! <br />
        Verify Your Email.</p>
        <p style='display:flex; align-items:center; justify-content:center;'><a href='${url}' style='background-color:blue; text-decoration:none; color:white; padding:10px 30px; border-radius:5px;'>Verify</a></p>    
    `)
    // console.log(sendmail);

    return res.status(200).json(
        new apiResponse(200,"User Registered Successfully. Check Email For Verification !",createdUser)
    )
})

const uploadUserAvatar = asyncHandler(async (req,res)=>{
    try {
        const user = req.user;
        const avatarLocalPath = req.file?.path
        if(!avatarLocalPath) return res.status(401).json(
            new apiResponse(401,"Please Select Image!")
        )
    
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if(!avatar) return res.status(401).json(
            new apiResponse(401,"Error in uploading avatar on cloudinary")
        )
    
        const response = await User.findByIdAndUpdate(user._id,
            {
                avatar:avatar?.url
            },
            {
                new:true
            }
        )

        return res.status(200).json(
            new apiResponse(200,"Upload avatar Successfully!",response)
        )
    } catch (error) {
        throw new apiError(500,"Uploading avatar Failed!")
    }
})

const verifyEmailUser = asyncHandler(async (req,res)=>{
    try {
        const {code} = req.body;
        if(!code){
            return res.status(404).json(
                new apiResponse(404,"UnAuthorized Access")
            )
        }

        const checkUser = await User.findOne({_id:code})
        if(!checkUser){
            return res.status(404).json(
                new apiResponse(404,"UnAuthorized Access")
            )
        }

        checkUser.verifyEmail=true;
        const verified = await checkUser.save();
        if(!verified){
            return res.status(500).json(
                new apiResponse(500,"Error in verifyEmail update")
            )
        }

        return res.status(200).json(
            new apiResponse(200,"Successfully Verified Email!",verified)
        )
    } catch (error) {
        throw new apiError(500,"Error in verify Email",error)
    }
})

const loginUser = asyncHandler(async (req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).json(
                new apiResponse(404,"All Feilds Are required!")
            )
        }

        const checkEmail = await User.findOne({email:email});
        if(!checkEmail){
            return res.status(404).json(
                new apiResponse(404,"UnAuthorized Access")
            )
        }

        const checkPassword = await checkEmail.isPasswordCorrect(password)
        // console.log(checkPassword)
        if(!checkPassword){
            return res.status(404).json(
                new apiResponse(404,"Incorrect Email or Password !")
            )
        }

        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(checkEmail._id)

        const options = {
            httpOnly : true,
            secure: true,
            sameSite:false
        }
    
        return res.cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
            new apiResponse(200,"Login User Successfuly!",{accessToken,refreshToken})
        )
    } catch (error) {
        throw new apiError(500,"LoginUser Error!",error)
    }
})

const logoutUser = asyncHandler(async (req,res)=>{
    try {
        const user = req.user;

        // const updated = await User.findByIdAndUpdate(user._id,{
        //     $unset:{
        //         refreshToken:1
        //     }
        // },{
        //     new:true
        // })
        const updated = await User.findByIdAndUpdate(user._id,{
            refreshToken:""
        },{
            new:true
        })
        if(!updated) return res.status(400).json(
            new apiResponse(400,"Error in Logout User updated")
        )

        const options = {
            httpOnly:true,
            secure:true,
            sameSite:false
        }
        return res.clearCookie("accessToken",options).clearCookie("refreshToken",options).json(
            new apiResponse(200,"user Logout Successfully!")
        )
    } catch (error) {
        throw new apiError(500,"LogoutUser Error!")
    }
})

const updateUserDetails = asyncHandler(async (req,res)=>{
    try {
        const user = req.user
        if(!user) return res.status(401).json(
            new apiResponse(401,"unauthorized Access!")
        )

        const {name,mobile} = req.body;
        if(!name) return res.status(401).json(
            new apiResponse(401,"All fields are required!")
        )

        const response = await User.findByIdAndUpdate(user._id,
            {
                $set:{
                    name,
                    mobile,
                }
            },
            {
                new:true
            }
        )

        return res.status(200).json(
            new apiResponse(200,"User details Updated Successfully!",response)
        )        
    } catch (error) {
        throw new apiError(500,"updateUserDetails Error",error)
    }
})

const updateAvatar = asyncHandler(async (req,res)=>{
    try {
        const user = req.user
        if(!user) return res.status(401).json(
            new apiResponse(401,"unauthorized Access user avatar!")
        )

        const avatarLocalPath = req.file?.path
        if(!avatarLocalPath) return res.status(401).json(
            new apiResponse(401,"Avatar is Required For Updation!")
        )

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        if(!avatar) return res.status(401).json(
            new apiResponse(401,"Cloudinary uploading Failed!")
        )
        // console.log(avatar)

        const response = await User.findByIdAndUpdate(user._id,{
            $set:{
                avatar:avatar?.url
            }
        },
        {
            new:true
        }
        ).select("-password -refreshToken")

        return res.status(200).json(
            new apiResponse(200,"Avatar Updated Successfully!",response)
        )
    } catch (error) {
        throw new apiError(500,"updateAvatar Failed!",error)
    }
})

const forgetPasswordUser = asyncHandler(async (req,res)=>{
    try {
        const {email} = req.body
        if(!email) return res.status(401).json(
            new apiResponse(401,"Email is required!")
        )

        const user = await User.findOne({email})
        if(!user) return res.status(400).json(
            new apiResponse(400,"unauthorized Access!")
        )

        const {otp,expiresIn} = generateOTP()
        if(!otp || !expiresIn) return res.status(500).json(
            new apiResponse(500,"OTP generation Failed!")
        )

        const response = await User.findByIdAndUpdate(user._id,{
            $set:{
                forgotPasswordOtp:otp,
                forgotPasswordExpiry:expiresIn
            }
        },{new:true})
        if(!response) return res.status(401).json(
            new apiResponse(401,"otp updation error!")
        )

        const sendmail = await sendMail(email,"Reset Password OTP",`
            <p>Dear ${user.name}</p>
            <p>Your Reset Password OTP is : </p>
            <p style='background-color:yellow; font-weight:700; font-size:18px; text-align:center; padding:20px'>${otp}</p>
            <p>Thanks From Blinkeyit</p>
            <p>Note : <span style='color:red'>Do Not Share OTP with AnyOne</span></p>
            `)
        if(!sendmail) return res.status(401).json(
            new apiResponse(401,"otp sending error!")
        )

        return res.status(200).json(
            new apiResponse(200,"Verification OTP send On Your Mail",sendmail)
        )
    } catch (error) {
        throw new apiError(500,"forgetPasswordUser Failed!",error)
    }
})

const verifyOTP = asyncHandler(async (req,res)=>{
    try {
        const {email,otp} = req.body
        if(!email || !otp) return res.status(401).json(
            new apiResponse(401,"Invalid Operation All fields are required!")
        )

        const user = await User.findOne({email})
        if(!user) return res.status(400).json(
            new apiResponse(400,"User Not Found")
        )

        const currentTime= Date.now();
        if(user.forgotPasswordExpiry < currentTime) return res.status(400).json(
            new apiResponse(400,"OTP was Expired!")
        )
        if(user.forgotPasswordOtp !== otp) return res.status(400).json(
            new apiResponse(400,"Invalid OTP!")
        )
        
        return res.status(200).json(
            new apiResponse(200,"verify OTP Successfully!")
        )
    } catch (error) {
        throw new apiError(500,"verifyOTP Failed!",error)
    }
})

const resetForgetPassword = asyncHandler(async(req,res)=>{
    try {
        const {email,newPassword,confirmPassword} = req.body
        if(!email || !newPassword || !confirmPassword) return res.status(401).json(
            new apiResponse(401,"All Fields are required!")
        )
        if(newPassword!== confirmPassword) return res.status(401).json(
            new apiResponse(401,"new password & confirm password should be same!")
        )

        const user = await User.findOne({email})
        if(!user) return res.status(401).json(
            new apiResponse(401,"unauthorized Access!")
        )

        user.password = newPassword;
        await user.save({validateBeforeSave:true})

        return res.status(200).json(
            new apiResponse(200,"password changed Successfully!")
        )
    } catch (error) {
        throw new apiError(500,"resetForgetPassword Failed!",error)
    }
})

const reLoginUser = asyncHandler(async(req,res)=>{
    try {
        const token = req?.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token) return res.status(401).json(
            new apiResponse(401,"unauthorized Access!")
        )
        
        const decode = await jwt.verify(token,process.env.REFRESH_TOKEN_SECRET);
        if(!decode) return res.status(401).json(
            new apiResponse(401,"invalid token!")
        )

        const user = await User.findOne({_id:decode._id})
        if(!user) return res.status(401).json(
            new apiResponse(401,"unauthorized user Access!")
        )

        const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);
        if(!accessToken || !refreshToken) return res.status(400).json(
            new apiResponse(400,"token generation failed!")
        )

        const options={
            httpOnly:true,
            secure:true,
            sameSite:false,
        }
        
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(
            new apiResponse(200,"Login again Successfully!",{accessToken,refreshToken})
        )
    } catch (error) {
        throw new apiError(500,"reLoginUser Failed!")
    }
})

const getCurrentUser = asyncHandler(async(req,res)=>{
    try {
        const user = req.user
        if(!user) return res.status(401).json(
            new apiResponse(401,"unauthorized Access!")
        )

        return res.status(200).json(
            new apiResponse(200,"Current User Details!",user)
        )
    } catch (error) {
        throw new apiError(500,"Fetch Current User Failed!",error)
    }
})

export {registerUser,uploadUserAvatar,verifyEmailUser,loginUser,logoutUser,updateUserDetails,updateAvatar,forgetPasswordUser,verifyOTP,resetForgetPassword,reLoginUser,getCurrentUser}