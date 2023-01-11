require('dotenv').config();

const mongoose = require("mongoose");
const mongo = process.env.MONGO_URI;


const connect = async () =>{
    try{
        await mongoose.connect(mongo, {
            useNewUrlParser: true,
            // useCreateIndex: true,
            // useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log( "MongoDB Connected...");
    }catch(err){
        console.log(" Gagal Blok...");
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connect;