const mongoose= require("mongoose");

const classScheme = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String,
        required: true
    },
    desc: {type: String},
    color: {type: String, default: "blue"},
    students: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
    },
    mapel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "mapel"
    },
    ujian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ujian"
    }
});

module.exports = mongoose.model("class", classScheme);