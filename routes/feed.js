const express = require("express");
const router = express.Router();

const feedController = require("../contorllers/feed");

// GET /posts
// desc Get list of posts
router.get("/posts", feedController.getPosts);

// POST /post
// desc Create a post
router.post("/post", feedController.postPost);

module.exports = router;
