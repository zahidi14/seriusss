const mongoose = require("mongoose");

const mapelSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    name: {
        type: String,
        required:  true
    }

});

module.exports = mongoose.model("mapel", mapelSchema);