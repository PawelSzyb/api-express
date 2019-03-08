exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: new Date(),
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/boots.jpg",
        creator: {
          name: "Paweł"
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.postPost = (req, res, next) => {
  const { title, content } = req.body;
  console.log(req.body);
  res.status(201).json({
    message: "Resource created",
    post: {
      _id: new Date().toISOString(),
      title: title,
      content: content,
      creator: { name: "Paweł" },
      createdAt: new Date()
    }
  });
};
