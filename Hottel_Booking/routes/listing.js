const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")

//  Index Route
router.get(
  "/",
  WrapAsync(listingController.index)
);

//  New Rout
router.get("/new", isLoggedIn, listingController.renderNewForm);

//  Show Rout
router.get(
  "/:id",
  WrapAsync(listingController.showListing)
);

//  Create Route

router.post(
  "/",
  isLoggedIn,
  validateListing,
  WrapAsync(listingController.createListing)
);

//  Edit  Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.renderEditForm)
);

//   Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  WrapAsync(listingController.updateListing)
);
 
//  Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.destroyListing)
);

module.exports = router;
