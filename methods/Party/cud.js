const nodemailer = require("nodemailer");
const asyncHandler = require("../../middlewares/async");
const Site = require("../../models/Site/Site");
const Party = require("../../models/Party/Party");

const methods = {
  //----- Create Header -----//
  create: asyncHandler(async (req, res, next) => {
    try {
      const { title } = req.body;
      let image;
      if (req.file) {
        image = req.file.filename;
      }

      const ownerId = req.user._id;

      // Saving User in DataBase
      const party = await Party.create({
        title,
        image,
        owner: ownerId,
      });

      res.status(200).json({ party: party });
    } catch (err) {
      next(err);
    }
  }),

  //----- Update Site Header -----//
  update: asyncHandler(async (req, res, next) => {
    try {
      const { title, partyId } = req.body;
      let image;
      if (req.file) {
        image = req.file.filename;
      }
      let party = await Party.findById(partyId);

      if (title) {
        party.title = title;
      }
      if (image) {
        party.image = image;
      }

      const updatedparty = await party.save();

      res.status(200).json({ message: "Success!", party: updatedparty });
    } catch (err) {
      next(err);
    }
  }),

  //----- Get site Header -----//
  getParty: asyncHandler(async (req, res, next) => {
    try {
      const partyId = req.body.partyId;
      const party = await Party.findById(partyId);
      res.status(200).json({ party: party });
    } catch (err) {
      next(err);
    }
  }),

  //----- Delete Event -----//
  deleteParty: asyncHandler(async (req, res, next) => {
    try {
      console.log(req.body);
      const postId = req.body.postId;
      if (!postId) return res.status(400).json({ message: "Provide post id" });
      await Party.findByIdAndDelete(postId);
      res.status(200).json({ message: "Successfully Deleted!" });
    } catch (err) {
      next(err);
    }
  }),

  //----- Get list of site headers -----//
  getParties: asyncHandler(async (req, res, next) => {
    try {
      const parties = await Party.find({});
      res.status(200).json({ parties: parties });
    } catch (err) {
      next(err);
    }
  }),
};

module.exports = methods;
