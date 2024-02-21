import mongoose from "mongoose";

const connectToMongo = ()=>{
    try{
        mongoose.connect(process.env.MONGO_STR);
        console.log("Connected to mongo.");
    }
    catch(err) {
        console.log(err);
    }
}

export default connectToMongo;