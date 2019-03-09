const {
  validationResult
} = require("express-validator/check")

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [{
      _id: new Date(),
      title: "First Post",
      content: "This is the first post!",
      imageUrl: "images/boots.jpg",
      creator: {
        name: "Paweł"
      },
      createdAt: new Date()
    }]
  });
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      msg: "Validation failed, enter correct data",
      errors: errors.array()
    })
  }
  const {
    title,
    content
  } = req.body;
  res.status(201).json({
    message: "Resource created",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: {
        name: "Paweł"
      },
      createdAt: new Date()
    }
  });
};