const mongoose = require("mongoose");
const Review = require("./review");

let link = 'https://images.pexels.com/photos/17560344/pexels-photo-17560344/free-photo-of-window-on-white-building-wall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide title for your listing"]
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
        // type: String, //because will pass image in url
        // set: (v) => v == "" ? link : v,
        // default: 'https://images.pexels.com/photos/17560344/pexels-photo-17560344/free-photo-of-window-on-white-building-wall.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    price: {
        type: Number,
        required: [true, "Please provide price for your listing"]

    },
    location: {
        type: String,
        required: [true, "Please provide location of your listing"]

    },
    country: {
        type: String,
        required: [true, "Please provide country of your listing"]

    },

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        },
    ],

    owner:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }

})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
