import mongoose,{Schema} from "mongoose";

const addressSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User id not found!"]
    },
    addressLine:{
        type:String,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    state:{
        type:String,
        default:""
    },
    pincode:{
        type:String,
        default:""
    },
    country:{
        type:String,
        default:""
    },
    mobile:{
        type:Number,
        default:null
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

export const Address = mongoose.model("Address",addressSchema);