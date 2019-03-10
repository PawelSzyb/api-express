const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");

const feedController = require("../contorllers/feed");

// GET /posts
// desc Get list of posts
router.get("/posts", feedController.getPosts);

// POST /post
// desc Create a post
router.post(
  "/post",
  [
    body("title")
      .trim()
      .isLength({
        min: 5
      }),
    body("content")
      .trim()
      .isLength({
        min: 5
      })
  ],
  feedController.postPost
);

// GET /post/:post_id
// desc Get single post
router.get("/post/:post_id", feedController.getPost);

// PUT /post/:post_id
// desc update single post
router.put(
  "/post/:post_id",
  [
    body("title")
      .trim()
      .isLength({
        min: 5
      }),
    body("content")
      .trim()
      .isLength({
        min: 5
      })
  ],
  feedController.updatePost
);

module.exports = router;
