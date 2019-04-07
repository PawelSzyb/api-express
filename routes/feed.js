const express = require("express");
const router = express.Router();
const { body } = require("express-validator/check");

const feedController = require("../contorllers/feed");
const isAuthenticated = require("../middleware/isAuth");

// GET /posts
// desc Get list of posts
router.get("/posts", isAuthenticated, feedController.getPosts);

// POST /post
// desc Create a post
router.post(
  "/post",
  isAuthenticated,
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
router.get("/post/:post_id", isAuthenticated, feedController.getPost);

// PUT /post/:post_id
// desc update single post
router.put(
  "/post/:post_id",
  isAuthenticated,
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

// DELETE /post/:post_id
// desc delete single post
router.delete("/post/:post_id", isAuthenticated, feedController.deletePost);

// get /post/status
// desc get user status
router.get("/status", isAuthenticated, feedController.getStatus);

// post /post/status/new
// desc update status
router.post("/status/new", isAuthenticated, feedController.putStatus);

module.exports = router;
