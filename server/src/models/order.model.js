import mongoose,{Schema} from 'mongoose'

const orderSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User id not found!"]
    },
    orderId:{
        type:String,
        required:[true, "order is Required"],
        unique:true
    },
    productId:{
        type:Schema.Types.ObjectId,
        ref:"Product"
    },
    productDetails:{
        name:String,
        image:Array
    },
    paymentId:{
        type:String,
        default:""
    },
    paymentStatus:{
        type:String,
        default:""
    },
    deliveryAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
    },
    subTotalAmount:{
        type:Number,
        default:0
    },
    totalAmount:{
        type:Number,
        default:0
    },
    invoiceReceipt:{
        type:String,
        default:""
    },
    quantity:{
        type:Number,
        default:1
    },
    price:{
        type:Number,
        default:0
    },
    // New delivery status fields
    deliveryStatus:{
        type:String,
        enum:["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default:"pending"
    },
    deliveryDate:{
        type:Date,
        default:null
    },
    trackingNumber:{
        type:String,
        default:""
    },
    deliveryNotes:{
        type:String,
        default:""
    }
},{timestamps:true})

export const Order = mongoose.model("Order",orderSchema)