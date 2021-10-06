const nodemailer = require("nodemailer");
const asyncHandler = require("../../middlewares/async");
const Site = require("../../models/Site/Site");
const Post = require("../../models/Post/Post");

const methods = {
  //----- Create post -----//
  create: asyncHandler(async (req, res, next) => {
    try {
      const { title, description } = req.body;
      let image, video;

      if (req.files.video) {
        video = req.files.video[0].filename;
      }
      if (req.files.image) {
        image = req.files.image[0].filename;
      }
      const ownerId = req.user._id;

      const newDescription = description.replace(/(<([^>]+)>)/gi, "");

      // Saving User in DataBase
      const post = await Post.create({
        title,
        description: newDescription,
        image,
        video,
        owner: ownerId,
      });

      res.status(200).json({ post: post });
    } catch (err) {
      next(err);
    }
  }),

  //----- Update post -----//
  update: asyncHandler(async (req, res, next) => {
    try {
      const { title, description, postId } = req.body;
      let image, video;

      if (req.files.video) {
        video = req.files.video[0].filename;
      }
      if (req.files.image) {
        image = req.files.image[0].filename;
      }
      let post = await Post.findById(postId);
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

      const updatedPost = await post.save();

      res.status(200).json({ message: "Success!", Post: updatedPost });
    } catch (err) {
      next(err);
    }
  }),

  //----- Get post -----//
  getPost: asyncHandler(async (req, res, next) => {
    try {
      const postId = req.query.postId;
      if (!postId) res.status(400).json({ message: "Provide post id" });
      const post = await Post.findById(postId);
      res.status(200).json({ post: post });
    } catch (err) {
      next(err);
    }
  }),

  //----- Get list of posts -----//
  getPosts: asyncHandler(async (req, res, next) => {
    try {
      const posts = await Post.find({});
      res.status(200).json({ posts: posts });
    } catch (err) {
      next(err);
    }
  }),

  //----- Delete Post -----//
  deletePost: asyncHandler(async (req, res, next) => {
    try {
      console.log(req.body);
      const postId = req.body.postId;
      if (!postId) return res.status(400).json({ message: "Provide post id" });
      await Post.findByIdAndDelete(postId);
      res.status(200).json({ message: "Successfully Deleted!" });
    } catch (err) {
      next(err);
    }
  }),

  //----- Search Post -----//
  search: asyncHandler(async (req, res, next) => {
    try {
      const title = req.query.title;
      const posts = await Post.find({ title: title });
      res.status(200).json({ posts });
    } catch (err) {
      next(err);
    }
  }),
};

module.exports = methods;
