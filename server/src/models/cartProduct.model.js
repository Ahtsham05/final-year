import mongoose,{Schema} from 'mongoose'

const cartProductSchema = new Schema({
    productId:{
        type:Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        default:1,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const cartProduct = mongoose.model("cartProduct",cartProductSchema)