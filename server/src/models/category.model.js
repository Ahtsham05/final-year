import mongoose,{Schema} from 'mongoose'

const categorySchema = new Schema({
    name:{
        type:String,
        required:[true,"category name is required"],
        unique:true
    },
    image:{
        type:String,
        default:""
    }
},{timestamps:true})

export const Category = mongoose.model("Category",categorySchema)