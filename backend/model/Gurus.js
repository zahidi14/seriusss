const mongoose = require("mongoose");

const GuruScheme = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"        
    },
    foto:{
        fileName:{ type: String},
        filePath: { type:String}
    },
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    address: {type: String},
    email: {type: String},
    phone: {type: String}
});

module.exports = mongoose.model("guru", GuruScheme);