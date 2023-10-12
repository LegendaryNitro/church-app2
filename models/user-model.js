const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: { type: String },
    origin:{type:String, default: 'Malonlin'},


    verified:{type: Boolean, default: false}

  },
  { timestamps: true },

);

module.exports = mongoose.model("UserChurchApp", UserSchema);
