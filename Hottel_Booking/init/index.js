const mongoose = require("mongoose");

const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb+srv://kanhaiyajee804418:58lYGjU6h5KxmDkn@cluster0.psookmx.mongodb.net/wanderlust"

main()
  .then(() => {
    console.log("connected to index DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner: "6694ce4bc4b56f9c0d3d71dd",}))
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
