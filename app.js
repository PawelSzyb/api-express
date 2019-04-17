const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const uuidv4 = require('uuid/v4');

const mongoURI = require('./config/keys').mongoURI;
const mongoose = require('mongoose');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, DELETE, PUT, PATCH'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({
    message: message,
    data: data
  });
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true
  })
  .then((res) => console.log('MongoDB connected'))
  .then((res) => {
    const server = app.listen(8080);
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
      console.log('Client connected');
    });
  })
  .catch((err) => console.log(err));
