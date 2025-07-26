import mongoose,{Schema} from 'mongoose'

const subCategorySchema = new Schema({
    name:{
        type:String,
        required:[true,"SubCategory name id required!"],
        unique:true
    },
    image:{
        type:String,
        default:""
    },
    category : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "Category"
        }
    ]
},{timestamps:true})

export const subCategory = mongoose.model("subCategory",subCategorySchema)

