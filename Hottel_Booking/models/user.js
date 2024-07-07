const mongoose = require("mongoose");
<<<<<<< HEAD
const Schema  = mongoose.Schema;
=======
const { Schema } = mongoose;
>>>>>>> bfbb5d9dfd2153c3e9039856c18f5da7017054ea
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
