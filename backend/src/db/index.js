import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URL}`
        );
        console.log(
            `/n MongoDB connected !! DB Host : ${connectionInstance.connection.host}`
        );
    } catch (err) {
        console.log(`MongoDB connection error `, err);
        process.exit(1);
    }
};

export default connectDB;
