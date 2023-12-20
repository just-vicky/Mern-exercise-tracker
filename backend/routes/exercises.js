const router = require("express").Router();
let Exercise = require("../models/exercise.model");
const mongoose = require("mongoose");  // Import mongoose module


router.route("/").get((req, res) => {
  Exercise.find()
    .then((exercises) => res.json(exercises))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);

  const newExercise = new Exercise({
    username,
    description,
    duration,
    date,
  });

  newExercise
    .save()
    .then(() => res.json("Exercise added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Exercise.findById(req.params.id)
    .then((exercise) => res.json(exercise))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json("Exercise deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  const exerciseId = req.params.id;
  console.log(exerciseId)

  if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
    return res.status(400).json({ error: "Invalid exerciseId" });
  }

  Exercise.findById(req.params.id)
    .then((exercise) => {
      if (!exercise) {
        return res.status(404).json({ error: "Exercise not found" });
      }
      
      
      exercise.username = req.body.username;
      exercise.description = req.body.description;
      exercise.duration = Number(req.body.duration);
      exercise.date =  Date.parse(req.body.date);

      exercise
        .save()
        .then(() => res.json(exercise))
        .catch((err) =>
          res
            .status(400)
            .json({ error: "Error saving exercise", details: err.message })
        );
    })
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Error finding exercise", details: err.message })
    );
});

module.exports = router;
