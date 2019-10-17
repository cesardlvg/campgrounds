const mongoose = require("mongoose");

// Schema Setup
var commentSchema = mongoose.Schema({
	text: String,
	createdAt: { type: Date, default: Date.now },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

// Save schema into a model 
module.exports = mongoose.model("Comment", commentSchema);