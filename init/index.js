const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}

main();

const data = async () => {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "678e73d47d399dedea49989d", // Ensure this is set correctly
    }));
    await Listing.insertMany(initData.data);
    console.log("Data inserted");
  } catch (error) {
    console.error("Error inserting data:", error.message);
  }
};

data();
