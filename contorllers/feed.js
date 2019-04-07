const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Post = require("../models/Post");
const User = require("../models/User");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.countDocuments()
    .then(total => {
      totalItems = total;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
      res
        .status(200)
        .json({ msg: "Posts fetched", posts: posts, totalItems: totalItems });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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

  let creator;

  const newPost = {
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file.path.replace("\\", "/"),
    creator: req.user_id
  };
  const post = new Post(newPost);
  post
    .save()
    .then(res => {
      return User.findById(req.user_id);
    })
    .then(user => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: "Resource created",
        post: post,
        creator: { _id: creator._id, name: creator.name }
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
    imageUrl = req.file.path.replace("\\", "/");
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

exports.deletePost = (req, res, next) => {
  const post_id = req.params.post_id;
  Post.findById(post_id)
    .then(post => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(post_id);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ msg: "Post deleted" });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.getStatus = (req, res, next) => {
  User.findById(req.user_id)
    .then(user => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 401;
        throw error;
      }
      res.status(200).json({ status: user.status });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

exports.putStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findOneAndUpdate({ _id: req.user_id }, { $set: { status: newStatus } })
    .then(result => {
      res.status(200).json({ msg: "Status updated" });
    })
    .catch(error => {
      if (!error.statusCode) {
        error.statusCode = 500;
        next(error);
      }
    });
};
