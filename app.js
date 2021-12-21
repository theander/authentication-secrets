require('dotenv')
  .config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PORT = process.env.PORT || 3000;


const saltRounds = 10;


const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String
});



const User = new mongoose.model('User', userSchema);



app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login")
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    console.log(newUser);
    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }

    });
  });

});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, (err, foundUser) => {
    bcrypt.compare(password, foundUser.password, function(err, result) {

      if (err) { res.send(err) } else {
        if (result === true) {
          res.render("secrets");
        } else {
          console.log("Fail");
        }
      }
    });
  });
});
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
