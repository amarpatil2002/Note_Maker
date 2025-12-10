const mongoose = require("mongoose")

const connectDB = async() => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
        console.log("Database successfully connected...");
    }catch(error){
        console.log("Database not connected - " + error);
    }
}

module.exports = connectDB