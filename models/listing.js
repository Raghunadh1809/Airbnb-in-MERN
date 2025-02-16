const mongoose = require("mongoose");
const reviews = require("./reviews");
const Schema = mongoose.Schema;

const listings = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  // image: {
  //   type: String,
  //   set: (v) =>
  //     v === " "
  //       ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  //       : v,
  // },
  image: {
    //   type: String,
    //   set: (v) =>
    //     !v || v.trim() === ""
    //       ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    //       : v,
    // },
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "reviews", // Ensure this matches the model name
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

listings.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await reviews.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// create collection
const Listing = mongoose.model("Listing", listings);

module.exports = Listing;
