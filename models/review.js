const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        max: [5, "Please rate between 1 to 5"],
        min: [1, "Please rate between 1 to 5"]
    },
    comment: String,

    createdAt: {
        type: Date,
        default: new Date()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;