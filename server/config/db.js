import mongoose from "mongoose";
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
    } catch (errors) {
        console.error("Database connection error:", errors);
    }

}
export default connectDB;