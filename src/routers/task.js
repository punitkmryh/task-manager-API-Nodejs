/**
 *	^ [...] -> ES6 spread operator -> consider all things before and with addition
 *	[Comment2]
 *
 * Author : punitkumaryh
 */
const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

// @ Folded Endpoints
//// Creating Tasks Route(Endpoint)
// #region Task Route
router.post("/tasks", auth, async (req, res) => {
  // const task1 = new task(req.body);

  //TODO: Creating relationship between task + user by adding owner to body
  const task1 = new Task({
    ...req.body,
    owner: req.authUser._id,
  });
  try {
    await task1.save();
    res.status(201).send(task1);
    // console.log("Successfully created! ", req.body);
  } catch (error) {
    res.status(400).send();
    console.log("Error : ", error);
  }
});
//#endregion

/**
 *	[Fetching All Tasks in DB]
 *	@Features:
 *  #1.Filtering data :-> /tasks?completed=true
 *  #2.Pagination :
 *    2.1. Limit : Shows first 10 results -> /tasks?limit=10
 *    2.2. Skip : Skips no of pages with limit -> /tasks?skip = 10 (skipping 1st page for 10 result )
 *  #3.Sorting : has two parts
 *  1.based property -> parts[0]-> can be completed / createdAt / updatedAt property in const `sort`
 *  2.based on desc or asc order with -1 and 1 resp..
 *  ^ All combined -> "/tasks/sortBy=createdAt:asc&limit=2&skip=2"
 */
// #region fetch AllTasks
router.get("/tasks", auth, async (req, res) => {
  const match = {}; //Stores  match property in a object
  const sort = {};

  //checking URL query for completed = true/false
  if (req.query.completed) {
    // $$ boolean return is "string" type from `req.query.completed`
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    // parts[0]-> can be completed / createdAt / updatedAt property in const `sort`
    // parts[1]-> completed:-1 either asc or desc
  }
  try {
    //#region TODO: Logic-> 1 finding tasks of owner using Populate()
    await req.authUser
      .populate({
        path: "ownerTasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate();
    res.status(200).send(req.authUser.ownerTasks);
    //#endregion

    //#region TODO: Logic-> 2 finding tasks of owner by passing object properties
    // const tasks = await Task.find({ owner: req.authUser._id });
    // res.status(200).send(tasks);
    //#endregion

    // console.log("Found all Tasks", task);
  } catch (error) {
    res.status(500).send(error);
    // console.log("Error:", error);
  }
});
//#endregion

//// Querying Tasks By Id in DB
// #region Find TaskById
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  // console.log("Id is :", _id);
  try {
    // const taskById = await Task.findById(_id);
    const taskByOwner = await Task.findOne({ _id, owner: req.authUser._id });

    if (!taskByOwner) {
      // console.log("Task not Found");
      return res.status(404).send("Task Not found");
    }
    res.status(200).send(taskByOwner);
    // console.log("Found Task: ", taskById);
  } catch (error) {
    res.status(400).send();
    console.log("Internal Error, unable to query such!", error);
  }
});
//#endregion

//// Updating Task By Id Endpoint
// #region Update Task by Id
router.patch("/tasks/:id", auth, async (req, res) => {
  //#region Validation
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));
  // If every update in updates
  // if each update includes in allowedUpdates
  if (!isValid) {
    res.status(400).send({
      error: "Not a valid update field",
    });
  }
  //#endregion

  try {
    const updateTaskId = await Task.findOne({
      _id: req.params.id,
      owner: req.authUser._id,
    });
    // const updateTaskId = await Task.findById(req.params.id);

    if (!updateTaskId) {
      res.status(404).send("User Not found");
    }
    //#region FIXME:
    updates.forEach((update) => {
      console.log("Each:", updateTaskId[update]);
      updateTaskId[update] = req.body[update];
    });
    await updateTaskId.save();
    //#endregion

    res.status(200).send(updateTaskId);
    // console.log("Updated Task-->", updateTask);
  } catch (error) {
    res.status(400).send();
    console.log("Error-->", error);
  }
});
//#endregion

//// Deleting task By Id Endpoint
//#region Deleting task by Id
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    //#region
    // const deletedTask = await Task.findByIdAndDelete(req.params.id);
    // res.status(200).send(deletedTask);
    //#endregion

    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.authUser._id,
    });
    if (!deletedTask) {
      res.status(404).send("404 Task Not found");
    }
    res.status(200).send(deletedTask);
    // console.log("deletedtask -->", deletedTask);
  } catch (error) {
    res.status(400).send();
    console.log("Error-->", error);
  }
});
//#endregion

module.exports = router;
