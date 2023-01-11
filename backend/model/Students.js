const mongoose = require("mongoose");

const StudentScheme = mongoose.Schema({
    class:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    },
    firstName:{
        type: String,
        required: true
    },
    lastName: {
        type:String
    },
    nis: {
        type: String,
        required : true
    },
    ttl: {
        type: Date,

    },
    alamat: {
        type: String
    }
});

module.exports = mongoose.model("student", StudentScheme);