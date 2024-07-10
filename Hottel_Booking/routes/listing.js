const express = require("express");
const router = express.Router();
const WrapAsync = require("../Utils/WrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn ,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
   .route("/")
   .get(WrapAsync(listingController.index))
//   .post(
//   isLoggedIn,
//   validateListing,
//   WrapAsync(listingController.createListing)
// );

.post( upload.single('listing[image]'), (req,res)=> {
  if (req.file) {
    res.send(req.file)
    // res.send(`File uploaded successfully: <a href="${req.file.path}" target="_blank">${req.file.filename}</a>`);
} else {
    res.send('File upload failed.');
}
})


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
