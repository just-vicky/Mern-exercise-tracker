const router = require('express').Router();
let User = require('../models/user.model');
const mongoose = require('mongoose');

//First endpoint that handle s http get request 
router.route('/').get((req,res)=> {
  User.find() // gives a list of all the users from DB 
  .then(users => res.json(users))//returns the response in a jsom
  .catch(err => res.status(400).json('Error: ' + err));
});

router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json("user deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});


router.route('/add').post(async(req, res) => {
  const username = req.body.username;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json('Username already exists');
    }

  const newUser = new User({username});

  await newUser.save();
    res.json('User added!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

router.route("/:id").get((req, res) => {
  const userId = req.params.id;
  console.log("Fetching user with ID:", userId);

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

router.route("/update/:id").post((req, res) => {
  const userId = req.params.id;
  console.log(userId)

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "user not found" });
      }
      
      
      user.username = req.body.username;

      user
        .save()
        .then(() => res.json(user))
        .catch((err) =>
          res
            .status(400)
            .json({ error: "Error saving user", details: err.message })
        );
    })
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Error finding user", details: err.message })
    );
});


module.exports = router;