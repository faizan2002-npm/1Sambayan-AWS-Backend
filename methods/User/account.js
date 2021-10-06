const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const asyncHandler = require("../../middlewares/async");
const User = require("../../models/User/User");
const sendEmail = require("../../services/sendEmail");

//REGISTER USER API
const methods = {
  registerUser: asyncHandler(async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirm_password,
        phone,
        fbLink,
        profession,
      } = req.body;

      //// Check If Password and Confirm Password are same or not ////
      if (password !== confirm_password) {
        res.status(403).send("Password and Confirm Password are not same");
      }

      //// Check If user exist with this Email or not ////
      const result = await User.findOne({ email: email });
      const hashedPassword = await helpers.genHashPassword(password);

      if (result) {
        res.status(404).send("User already registered with this Email Address");
      } else {
        // Saving User in DataBase
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          fbLink,
          profession,
        });

        res.status(200).json({ user: user });
      }
    } catch (err) {
      next(err);
    }
  }),

  // Email Verfication for new Registrations //
  verifyEmail: asyncHandler(async (req, res, next) => {
    async.waterfall(
      [
        function (done) {
          crypto.randomBytes(20, function (err, buf) {
            var token = buf.toString("hex");
            done(err, token);
          });
        },
        function (token, done) {
          const email = req.body.email;
          User.findOne(
            {
              email: email,
            },
            function (err, user) {
              if (!user) {
                return res.status(403).json({
                  message: "No account with that email address exists",
                });
              }
              User.findOneAndUpdate(
                { email: email },
                {
                  $set: {
                    verifyEmailToken: token,
                    emailVerificationExpiresIn: Date.now() + 36000000,
                  },
                },
                { new: true },
                function (err) {
                  done(err, token, user);
                }
              );
            }
          );
        },
        function (token, user, done) {
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            tls: {
              rejectUnauthorized: false,
            },
            auth: {
              user: process.env.MailingId,
              pass: process.env.MailingPassword,
            },
          });
          var mailOptions = {
            to: user.email,
            from: process.env.MailingId,
            subject: "Verfication Email Request for WINA",
            text:
              "You are receiving this because you (or someone else) have requested to register your account on WINA.\n\n" +
              "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
              "http://" +
              req.headers.host +
              "/reset/" +
              token +
              "\n\n" +
              "If you did not request this, please ignore this email.\n",
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.status(400).json({ message: error.message });
            }
            res
              .status(200)
              .json({ message: "Verification Email has been sent" });
          });
        },
      ],
      function (err) {
        if (err) return next(err);
        res.status(200).send("Verfication Email has been sent Successfully");
      }
    );
  }),

  verifyEmailProcess: asyncHandler(async (req, res, next) => {
    async.waterfall(
      [
        function (done) {
          User.findOne(
            {
              verifyEmailToken: req.params.token,
              emailVerificationExpiresIn: {
                $gt: Date.now(),
              },
            },
            async function (err, user) {
              if (!user) {
                return res.status(403).json({
                  message: "Password reset token is invalid or has expired",
                });
              } else {
                var user = await User.findOneAndUpdate(
                  {
                    verifyEmailToken: req.params.token,
                  },
                  {
                    $set: {
                      status: "active",
                    },
                  }
                );

                let transporter = nodemailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false,
                  tls: {
                    rejectUnauthorized: false,
                  },
                  auth: {
                    user: process.env.MailingId,
                    pass: process.env.MailingPassword,
                  },
                });
                var mailOptions = {
                  to: user.email,
                  from: process.env.MailingId,
                  subject: "Success Message",
                  text:
                    "Hello,\n\n" +
                    "You have successfully verified " +
                    user.email +
                    " \n",
                };
                transporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    return res.status(400).json({ message: error.message });
                  }
                  res.status(200).json({
                    message: "Success! You have successfully registed on WINA",
                  });
                  done(err);
                });
              }
            }
          );
        },
      ],
      function (err) {
        console.log(err);
      }
    );
  }),

  //Login User
  login: asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const schema = Joi.object().keys({
      email: Joi.string().max(40).required().email(),
      password: Joi.string().min(6).max(255).required(),
    });

    const results = schema.validate(req.body);
    if (results.error) {
      return res.status(400).send(results.error.details[0].message);
    }

    //validating email and password
    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }

    // check if user exists //
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      return res.status(400).send("You are not registered, Please Sign up!");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).send("Password is Invalid");
    }
    helpers.sendTokenResponse(user, 200, res);
  }),

  // USER Logout
  logout: asyncHandler(async (req, res, next) => {
    req.session.destroy(() => {
      req.logOut();
      res.clearCookie("token");
      res.status(200).send("Logged out successfully");
    });
  }),

  //----- Mail to reset password ----//
  mailForResetPassword: asyncHandler(async (req, res, next) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email: email });
      const resetToken = user.getResetPasswordToken();
      await user.save({ validateBeforeSave: false });
      const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:${resetToken}`;

      try {
        await sendEmail({
          email: user.email,
          subject: "Password reset token",
          message: message,
        });
        res.status(200).json({ success: true, data: "Email sent" });
      } catch (error) {
        res.status(404).json({ message: "Internelm Error" });
      }
    } catch (err) {
      next(err);
    }
  }),

  //----- Reset password ----//
  resetPassword: asyncHandler(async (req, res, next) => {
    try {
      const resetPasswordToken = req.params.resetPasswordToken;
      const password = req.body.password;
      const hashedPassword = await helpers.genHashPassword(password);

      let user = await User.findOne({ resetPasswordToken: resetPasswordToken });
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.restPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res
        .status(200)
        .json({ message: "Password has been Updated successfully" });
    } catch (error) {
      next(error);
    }
  }),
};
module.exports = methods;

const helpers = {
  //Get token from Model create cookie and send response
  sendTokenResponse: (user, statusCode, res) => {
    //create token

    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    if (process.env.NODE_ENV === "production") {
      options.secure = true;
    }
    if (user) {
      res
        .status(statusCode)
        .cookie("token", token, options)
        .json({ token: token, user: user });
    } else {
      res.send("Invalid Permissions");
    }
  },

  //Encrypt Password
  genHashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },
};
