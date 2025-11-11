import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Ensure MONGO_URI is properly formatted
        let mongoUri = process.env.MONGO_URI;
        
        // Add 'mongodb+srv://' prefix if not present
        if (mongoUri && !mongoUri.startsWith('mongodb')) {
            mongoUri = `mongodb+srv://${mongoUri}`;
        }
        
        // Add database name and options
        const dbName = 'todo-app';
        const options = 'retryWrites=true&w=majority';
        
        const connectionString = `${mongoUri}/${dbName}?${options}`;
        
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};
