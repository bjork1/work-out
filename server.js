const express = require("express");
let mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const Workout = require("./models/workout.js");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

const logger = require("morgan");
const path = require("path");
app.use(logger("dev"));

const data = {
  array: ["item1", "item2", "item3"],
  boolean: false,
  string:
    "\"Don't worry if it doesn't work right. If everything did, you'd be out of a job\" - Mosher's Law of Software Engineering",
  number: 42,
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.post("/api/workouts", ({ workout }, res) => {
  // const workout = new Workout({ exercises: req.body });
  Workout.create(workout)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.post("/api/workouts/bulk", ({ workout }, res) => {
  Workout.insertMany(workout)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.get("/api/workouts", (req, res) => {
  Workout.find({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  Workout.findById(id)
    .then((dbWorkout) => {
      dbWorkout.exercises.push(data);
      return dbWorkout;
    })
    .then((dbWorkout) => {
      Workout.findOneAndUpdate(
        { _id: id },
        { exercises: dbWorkout.exercises },
        { new: true }
      )
        .then((dbWorkout) => {
          res.json(dbWorkout);
        })
        .catch((err) => {
          res.json(err);
        });
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/workouts/range", async (req, res) => {
  Workout.find({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

//app.use(require("./routes/api.js"));
app.listen(PORT, function () {
  console.log("App now listening at localhost:" + PORT);
});
