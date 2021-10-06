const nodemailer = require("nodemailer");
const asyncHandler = require("../../middlewares/async");
const User = require("../../models/User/User");

//REGISTER USER API
const methods = {
  //----- Forgot Password -----//
  forgotPassword: asyncHandler(async (req, res, next) => {
    try {
      const { oldPassword, newPassword, email } = req.body;
      if (!oldPassword && !newPassword && !email)
        return res.status(400).json({ message: "Missing fields" });

      //----- check if user exists in Database -----//
      let user = await User.findOne({ email: email }).select("password");
      if (!user)
        return res.status(401).json({ message: "Invalid Permissions" });

      const isPassword = await user.matchPassword(oldPassword);
      if (isPassword) {
        user.password = newPassword;
        await user.save();
        return res
          .status(200)
          .json({ message: "Password updated successfully!" });
      } else {
        //----- Incorrect Password -----//
        return res.status(401).json({ message: "Invalid Permissions" });
      }
    } catch (err) {
      next(err);
    }
  }),

  //----- Edit Profile -----//
  getProfile: asyncHandler(async (req, res, next) => {
    try {
      const user = req.user;
      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }),

  //----- Edit Profile -----//
  editProfile: asyncHandler(async (req, res, next) => {
    try {
      let { firstName, lastName, email, phone } = req.body;
      let image;
      if (req.file) {
        image = req.file.filename;
      }
      console.log("req.body",req.body);
      console.log("req.file",req.file);

      let user = req.user;
      if (firstName) {
        user.firstName = firstName;
      }
      if (lastName) {
        user.lastName = lastName;
      }
      if (email) {
        user.email = email;
      }
      if (phone) {
        user.phone = phone;
      }
      if (image) {
        user.profileImage = image;
      }

      await user.save();
      return res.status(200).json({ message: "profile updated successfully!" });
    } catch (err) {
      next(err);
    }
  }),
};
module.exports = methods;
