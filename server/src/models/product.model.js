import mongoose,{Schema} from 'mongoose'

const productSchema = new Schema({
    name:{
        type:String,
        required:[true,"Product Name is required!"],
    },
    image:{
        type:Array,
        default:[]
    },
    categoryId:[{
        type:Schema.Types.ObjectId,
        ref:"Category"
    }],
    subCategoryId:[{
        type:Schema.Types.ObjectId,
        ref:"subCategory"
    }],
    unit:{
        type:String,
    },
    stock:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        default:0
    },
    description:{
        type:String,
        default:""
    },
    moreDetails:{
        type:Object,
        default:{}
    },
    publish:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

productSchema.index({
    name:"text",
    description:"text"
},
{
    name:10,
    description:5
}
)

export const Product = mongoose.model("Product",productSchema);