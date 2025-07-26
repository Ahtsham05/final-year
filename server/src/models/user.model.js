import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name is Required"],
    },
    email:{
        type:String,
        required:[true,"email is required field"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    avatar:{
        type:String,
        default:""
    },
    mobile:{
        type:Number,
        default:null
    },
    refreshToken:{
        type:String,
        default:""
    },
    verifyEmail:{
        type:Boolean,
        default:false
    },
    lastLoginDate:{
        type:Date,
        default:null,
    },
    status:{
        type:String,
        enum:["Active","Inactive","Suspended"],
        default:"Active"
    },
    addressDetails:[{
        type:Schema.Types.ObjectId,
        ref:"Address"
    }],
    shoppingCart:[{
        type:Schema.Types.ObjectId,
        ref:"cartProduct"
    }],
    orderHistory:[{
        type:Schema.Types.ObjectId,
        ref:"Order"
    }],
    forgotPasswordOtp:{
        type:String,
        default:""
    },
    forgotPasswordExpiry:{
        type:Date,
        default:null
    },
    role:{
        type:String,
        enum:["ADMIN","USER"],
        default:"USER"
    }
},{timestamps:true});

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email,
            avatar:this.avatar,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = new mongoose.model("User",userSchema);