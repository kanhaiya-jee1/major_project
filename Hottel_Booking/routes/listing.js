const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")

router
   .route("/")
   .get(WrapAsync(listingController.index))
  .post(
  isLoggedIn,
  validateListing,
  WrapAsync(listingController.createListing)
);

//  New Rout
router.get("/new", isLoggedIn, listingController.renderNewForm);
 
router.route("/:id")
.get(
  WrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    WrapAsync(listingController.updateListing))
    .delete(
      isLoggedIn,
      isOwner,
      WrapAsync(listingController.destroyListing)
    );

//  Edit  Route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  WrapAsync(listingController.renderEditForm)
);

module.exports = router;
