const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.reviewPost = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);

    let { rating, comments } = req.body;
    let newReview = new Review({
        comment: comments,
        rating: rating,
        createdBy: req.user._id

    });
    listing.reviews.push(newReview);
    // console.log(req.user);
    // console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Review created");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReviewPost = async (req, res) => {
    let { lid, rid } = req.params;
    if (req.user) {
        let result = await Review.findByIdAndDelete(rid);
        await Listing.findByIdAndUpdate(lid, { $pull: { reviews: rid } });

        req.flash("success", "Review deleted");
        res.redirect(`/listings/${lid}`);
    }
    else {
        req.flash("error", "You must be logged in first!");
        res.redirect(`/listings/${lid}`);
    }

}