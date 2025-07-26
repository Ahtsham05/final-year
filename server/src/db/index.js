import mongoose from 'mongoose'

const connectDB = async ()=>{
    try {
        const connectInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb connect Successfully",connectInstance.connection.host)
    } catch (error) {
        console.log("Error connecting MongoDB: ", error)
        process.exit(1)
    }
}
export default connectDB