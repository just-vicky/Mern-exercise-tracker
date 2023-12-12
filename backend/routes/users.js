const router = require('express').Router();
let User = require('../models/user.model');

//First endpoint that handle s http get request 
router.route('/').get((req,res)=> {
  User.find() // gives a list of all the users from DB 
  .then(users => res.json(users))//returns the response in a jsom
  .catch(err => res.status(400).json('Error: ' + err));
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


module.exports = router;