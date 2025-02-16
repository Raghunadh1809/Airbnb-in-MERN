const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewRoute = (req, res) => {
  console.log(req.user);
  res.render("./listings/create.ejs");
};

module.exports.ShowListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // console.log("Show Listing : ", listing);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  // let {title,description,location,price}=req.body;
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send Valid data in the listing");
  // }
  // let result = listingschema.validate(req.body);
  // console.log(result);
  // if (result.error) {
  //   throw new ExpressError(401, `Validation in Joi Schema , ${result.error}`);
  // }
  let url = req.file.path;
  let filename = req.file.filename;

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // new user login and create new listings
  newListing.image = { url, filename };
  await newListing.save();
  console.log("Creating New Listing : ", newListing);
  req.flash("success", "New Created Listing");
  res.redirect("/listings");
};

module.exports.EditListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listings/edit.ejs", { listing });
};

module.exports.UpdateListing = async (req, res) => {
  let { id } = req.params;
  let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
    new: true,
  });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }
  console.log("Updating Listing :", updatedListing);
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.Destory = async (req, res) => {
  const { id } = req.params;
  const deleteListing = await Listing.findByIdAndDelete(id);
  console.log("Deleting Listing :", deleteListing);
  req.flash("success", "Deleted Listing");
  res.redirect("/listings");
};
