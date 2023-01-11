const mongoose = require("mongoose");

const ujianSchema= mongoose.Schema({
    user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user"
	},
	name: {
		type: String,
		required: true
	},
	evalDate: { type: Date, default: Date.now },
	class: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "class"
	},
	jumlah: {
		type: Number,
		required: true
	},
	p_corr: {
		type: Number,
		default: 4
	},
	p_incor: {
		type: Number,
		default: -1
	},
	p_blank: {
		type: Number,
		default: 0
	},
	mapels: [
		{
			c: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "mapel"
			},
			qFrom: { type: Number },
			qTo: { type: Number }
		}
	],
	answers: [{ type: String, required: true }],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model("ujian", ujianSchema);