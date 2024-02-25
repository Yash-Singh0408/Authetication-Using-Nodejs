const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require ('passport')

//User model
const User = require("../models/User");

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Register Page
router.get("/register", (req, res) => {
  res.render("register");
});

//Register Handel
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //Check required Fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //Check password match
  if (password !== password2) {
    errors.push({ msg: "Password Do Not Match" });
  }

  //Check lenght
  if (password.length < 6) {
    errors.push({ msg: "Password Atleast 6 Character" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    //Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User Exists
        errors.push({ msg: "Email is Registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        //Hash Password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            //Set password to hash
            newUser.password = hash;
            //Save User
            newUser.save()
            .then(user => {
                req.flash('success_msg' , 'You are now Registered Login Now')
                res.redirect('/users/login')

            })
            .catch(err => console.log(err));

          })
        );
      }
    });
  }
});

//Login Handel 
router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

//Logout Handle
router.get('/logout', (req, res) => {
  req.logOut(function(err) {
      if (err) {
          // Handle error
          return next(err);
      }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/users/login');
  });
});


module.exports = router;
