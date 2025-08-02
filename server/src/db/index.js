import mongoose from 'mongoose'

let isConnected = false;

const connectDB = async () => {
    // If already connected, return
    if (isConnected) {
        return;
    }

    try {
        // Set mongoose options for serverless
        mongoose.set('strictQuery', true);
        
        const connectInstance = await mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false, // Disable mongoose buffering
            maxPoolSize: 1, // Maintain up to 1 socket connection
        });
        
        isConnected = connectInstance.connections[0].readyState === 1;
        console.log("MongoDB connected successfully", connectInstance.connection.host);
    } catch (error) {
        console.log("Error connecting MongoDB: ", error);
        throw error; // Don't exit in serverless
    }
}

export default connectDB