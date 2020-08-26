const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }

  // task.save().then(()=>{
  //     res.status(201).send(task)
  // }).catch((e)=>{
  //     res.status(400).send(e)
  // })
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const splits = req.query.sortBy.split(":");
    sort[splits[0]] = splits[1] === "desc" ? -1 : 1;
  }
  try {
    // const tasks= await Task.find({ owner : req.user._id})
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
    // res.send(tasks)
  } catch (e) {
    res.status(500).send(e);
  }

  // Task.find({}).then((tasks)=>{
  //     res.send(tasks)
  // }).catch((e)=>{
  //     res.status(500).send(e)
  // })
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    //const task = await Task.findById(_id)
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    console.log(task);
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }

  // Task.findById(_id).then((task)=>{
  //     if(!task){
  //         return res.status(404).send()
  //     }
  //     res.send(task)
  // }).catch((e)=>{
  //     res.status(500).send(e)
  // })
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) {
    return res.status(400).send("Invalid Updates");
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    //const task = await Task .findByIdAndUpdate(req.params.id , req.body , {runValidators:true , new:true})
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (
      !(
        file.originalname.endsWith(".jpg") ||
        file.originalname.endsWith(".jpeg") ||
        file.originalname.endsWith(".png")
      )
    ) {
      return cb(new Error("Provide an image"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/tasks/:id/image",
  auth,
  upload.single("image"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    task.image = buffer;
    await task.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/tasks/:id/image", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task || !task.image) {
      throw new Error();
    }
    res.set("Content-Type", "image/jpg");
    res.send(task.image);
  } catch (e) {
    res.status(404).send();
  }
});

router.delete("/tasks/:id/image", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, owner: req.user._id });
    if (!task || !task.image) {
      throw new Error();
    }
    task.image = undefined;
    await task.save();
    res.status(200).send();
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
