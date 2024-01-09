import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
const connectDb= async():Promise<void>=>{
    try{
        const dbString:string=process.env.DB_CONFIG||'localhost'
        await mongoose.connect(dbString,{
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })
        console.log('Connected to db')
    }
    catch(err){
        console.log("Error in connecting to db: ",err);
        process.exit(1);
    }
}

const disconnectDb=async():Promise<void>=>{
    try{
        await mongoose.disconnect();
        console.log("Disconnected db")
    }
    catch(err){
        console.log("Error in disconnecting to db: ",err);
    }
}

export { connectDb,disconnectDb };