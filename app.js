const express = require('express');
const app = express();
const User = require('./models/User');
const mongoose = require('mongoose');

const PORT = 3000;
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const startServer = async () => {
  try {
    mongoose.connection
      .on('open', () => console.log('connection is ready'))
      .on('error', (error) => console.log(error))

    await mongoose.connect('mongodb://mongo:27017/docker', {
      useFindAndModify: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(PORT, () => console.log('we on air'));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

app.get('/', async (req, res) => {
  const users = await User.find();
  res.render('index', {
    users
  });
});

app.post('/', async (req, res) => {
  const {name, password} = req.body;
  const newUser = new User({name, password});
  await newUser.save();
  res.redirect('/');
});

startServer();