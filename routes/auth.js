const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// // Require the User and Group model in order to interact with the database
// const User = require
// const Group = require


// // handles session/cookies
// const session = require('express-session');
// module.exports = User

// // required for the app when deployed to Heroku (in production)
//   User.set('trust proxy', 1);

// // using session
// User.use(
//   session({
//     secret: process.env.SESSION_SECRET ,
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       secure: process.env.NODE_ENV === 'production',
//       httpOnly: true,
//       maxAge: 60000 * 60 // 60 * 1000 ms === 1 min
//     }
//   })
// );

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const res = require("express/lib/response");
const { findById } = require("../models/User");

// SIGNUP
router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .render("auth/signup", { errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth.signup", { errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});
//________________________________________________________________________________________

// LOGIN
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your username." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      next(err);
       return res.status(500).render("login", { errorMessage: err.message });
    });
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});
//________________________________________________________________________________________

// SEARCH page for aviliable groups
// accessible incl. non-loged-in users for viewing the offerings  
router.get("/search", (req, res, next) => {
  const { from, to, date } = req.body;

  if (!from) {
    return res
      .status(400)
      .render('search', { errorMessage: 'please provide a valid starting point'})
  }

  if (!to) {
    return res
      .status(400)
      .render('search', { errorMessage: 'please provide a valid destination point'})
}

if (!date) {
  return res      
  .status(400)
  .render('search', { errorMessage: 'please provide a valid date'})
}})
//________________________________________________________________________________________

// USERPAGE Page
router.get("/userprofile", isLoggedOut, (req, res, next) => {
  res.render("auth/login")
})

router.get("/userprofile", isLoggedIn, (req, res, next) => {
User.findOne({ username })
  .then((user) => {
    req.session.user = user;
    return res.render("userprofile/:_id")
  })
  .catch((err) => {
    next(err);
     return res.status(500).render("auth/login", { errorMessage: err.message });
  });
})


module.exports = router;
