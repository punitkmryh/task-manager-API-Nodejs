/**
 * TODO : Creating REST API for TASK MANAGER
 *
 * ^ ENDPOINTS(Routes) -> By Creating-Reading-Updating-deleting
 * REST API methods - <GET>/<POST>/<PATCH/PUT>/<DELETE>
 *
 * @ Status code:
 * 100 Continue
 * 200 OK
 * 201 Created
 * 400 Bad Request
 * 404 Not Found
 * 500 Internal Server Error
 *
 * $$ JSON Web Token
 * @ jwt.sign()
 * return `token` is base64 encoded json string -> separated with 3 periods
 *	1. headers - meta-info(type of token ),algorithm used
 *  2. Payload/body - data provided(id like)
 *  3. Signature - used to verify token
 *
 * @ jwt.verify()
 * return `payload` for token ["...":"...", iat:... ] iat -> issued at @
 *
 * @ res.send()
 * behind th scenes `JSON.stringify()` is
 *
 * @ Populate()
 * used for populating the data inside the reference
 *
 * Author: punitkumaryh
 */

// #region importing modules
const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
//#endregion

const app = express();
const port = process.env.PORT;

//#region Endpoint for Uploading file using multer
// const multer = require("multer");
// creating multer instance
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//cb->callback
//#region looking for pdf extension file
// if (!file.originalname.endsWith(".pdf")) {
//   return cb(new Error("please upload pdf file"));
// }
// cb(undefined, true);
//#endregion

//#region matching for .doc or .docx extension file
// originalname-> finds file name uploaded from user's computer
// if (!file.originalname.match(/\.(doc|docx)$/)) {
//   return cb(new Error("Please upload .doc or .docx file"));
// }
// cb(undefined, true);
//#endregion
//   },
// });

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   // handling express error by sending error injson format
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );
//#endregion

//#region MIddleware experiments
//#region Middle-ware to disable non-Signed-up user
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request is disabled");
//   } else {
//     next();
//   }
// });
//#endregion
//#region Middle-ware for Maintenance mode
// app.use((req, res, next) => {
//   //#region Logic-1
//   // if (req.method === "GET" || "POST" || "PATCH" || "DELETE") {
//   //   res.status(503).send("Site under maintenance");
//   // } else {
//   //   next();
//   // }
//   //#endregion

//   // #region Logic-2
//   res.send(503).send("Site under maintenance");
//   //#endregion
// });
//#endregion
//#endregion

//A method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());
//Routers List
app.use(userRouter);
app.use(taskRouter);

//#region Router Example
// const router = new express.Router();
// router.get("/test", (req, res) => {
//   res.send("Router Concept");
// });
// app.use(router);
//#endregion

// TODO: Running app(API) Server on Port 3000
app.listen(port, () => {
  console.log("Server is Up Running on " + port);
});

// * CASE_STUDIES:
//// Implementing bcrypt on user's password
//#region bcrypt
// const bcrypt = require("bcryptjs");

// const myfun = async () => {
//   const password = "password123";
//   const hashedPassword = await bcrypt.hash(password, 8);
//   console.log(hashedPassword);

//   const isMatch = await bcrypt.compareSync(password, hashedPassword);
//   console.log(isMatch);
// };

// myfun();
//#endregion

//// Implementing json web token
//#region JWT
// const jwt = require("jsonwebtoken");
// const myfunction = async () => {
//   // Synchronous Sign() with default (HMAC SHA256)
//   const token = jwt.sign({ _id: "abc123" }, "jsonwebtoken", {
//     expiresIn: "7 days",
//   }); // "jsonwebtoken" is secret key
//   console.log(token);

//   const data = jwt.verify(token, "jsonwebtoken");
//   console.log(data); // { _id: 'abc123', iat: 1593293711 }
// };
// myfunction();
//#endregion

//// Experimenting "toJSON" method (during Private data hiding)
//#region FIXME:
// const pet = {
//   name: "jackie",
// };
// // console.log(pet);

// pet.toJSON = function () {
//   console.log(this); //{ name: 'jackie', toJSON: [Function] }
//   return this;
// };

// console.log(JSON.stringify(pet)); //{"name":"jackie"}

//#endregion

//// Experimenting User relation with task
//#region  FIXME:
// const Task = require("./models/task");

// const main = async () => {
  //#region TODO: Finding Owner/user using Task model
  // const task = await Task.findById("5efce509d7eb1b40b6cbebf5");
  // // populate
  // await task.populate("owner").execPopulate();
  // console.log(task.owner);
  //#endregion
  //#region TODO: Finding registered tasks using User model
  // const user = await User.findById("5efce18ac4c9302ee83265ea");
  // await user.populate("ownerTasks").execPopulate();
  // console.log(user.ownerTasks);
  //#endregion
// };

// main();
//#endregion
