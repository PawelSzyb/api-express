const Post = require("../models/Post");
const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json({
        msg: "Posts fetched",
        posts: posts
      });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, enter correct data");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }
  const newPost = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file.path.replace("\\", "/"),
    creator: {
      name: "Paweł"
    }
  };
  const post = new Post(newPost);
  post
    .save()
    .then(newPost => {
      res.status(201).json({
        message: "Resource created",
        post: newPost
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const { post_id } = req.params;
  Post.findById(post_id)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ msg: "Post found", post: post });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, enter correct data");
    error.statusCode = 422;
    throw error;
  }
  const post_id = req.params.post_id;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file attached");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(post_id)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }
      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;
      return post.save();
    })
    .catch(updatePost => {
      res.status(200).json({ msg: "Post updated", post: updatePost });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, err => console.log(err));
};
