const asyncHandler = require("../../middlewares/async");
const Event = require("../../models/Event/Event");

const methods = {
  //----- Create Event -----//
  create: asyncHandler(async (req, res, next) => {
    try {
      const { title, description } = req.body;
      let video, image;

      if (req.files.video) {
        video = req.files.video[0].filename;
      }
      if (req.files.image) {
        image = req.files.image[0].filename;
      }
      const ownerId = req.user._id;
      const newDescription = description.replace(/(<([^>]+)>)/gi, "");

      // Saving User in DataBase
      const event = await Event.create({
        title,
        description: newDescription,
        image,
        video,
        owner: ownerId,
      });

      res.status(200).json({ event: event });
    } catch (err) {
      next(err);
    }
  }),

  //----- Update Event -----//
  update: asyncHandler(async (req, res, next) => {
    try {
      const { title, description, eventId } = req.body;
      let video, image;

      if (req.files.video) {
        video = req.files.video[0].filename;
      }
      if (req.files.image) {
        image = req.files.image[0].filename;
      }
      let event = await Event.findById(eventId);

      if (title) {
        post.title = title;
      }
      if (description) {
        const newDescription = description.replace(/(<([^>]+)>)/gi, "");
        post.description = newDescription;
      }
      if (image) {
        post.image = image;
      }
      if (video) {
        post.video = video;
      }

      const updatedEvent = await event.save();

      res.status(200).json({ message: "Success!", Event: updatedEvent });
    } catch (err) {
      next(err);
    }
  }),

  //----- Get Event -----//
  getEvent: asyncHandler(async (req, res, next) => {
    try {
      const eventId = req.query.eventId;
      const event = await Event.findById(eventId);
      res.status(200).json({ event });
    } catch (err) {
      next(err);
    }
  }),

  //----- Get list of Events -----//
  getEvents: asyncHandler(async (req, res, next) => {
    try {
      const events = await Event.find({});
      res.status(200).json({ events });
    } catch (err) {
      next(err);
    }
  }),

  //----- Delete Event -----//
  deleteEvent: asyncHandler(async (req, res, next) => {
    try {
      console.log(req.body);
      const postId = req.body.postId;
      if (!postId) return res.status(400).json({ message: "Provide post id" });
      await Event.findByIdAndDelete(postId);
      res.status(200).json({ message: "Successfully Deleted!" });
    } catch (err) {
      next(err);
    }
  }),

  //----- Search Event -----//
  search: asyncHandler(async (req, res, next) => {
    try {
      const title = req.query.title;
      const events = await Event.find({ title: title });
      res.status(200).json({ events });
    } catch (err) {
      next(err);
    }
  }),
};

module.exports = methods;
