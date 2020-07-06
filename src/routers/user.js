const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();

// %% Folded Endpoints

// @ Sign-Up ->Public (No Need authentication)
// Sign-Up (Creating User) Route(Endpoint)
// #region Sign up User Route
router.post("/users", async (req, res) => {
  const user1 = new User(req.body);

  ////Using Promise
  //#region User 1.1:Promise
  // user1
  //   .save()
  //   .then((user1) => {
  //     res.status(201).send(user1);
  //     console.log(req.body);
  //   })
  //   .catch((error) => {
  //     res.status(400).send(error);
  // console.log("User error is : ", error);
  //   });
  //#endregion

  //// Using Async-await
  try {
    // TODO: Creates and stores user instance details  into DB
    const newUser = await user1.save();

    // TODO: Generating AUTH-TOKEN for created user
    const authToken = await newUser.generateAutToken();
    res.status(201).send({ newUser, authToken });

    // ^ `tokenSet` inside document for server DB to track and `authToken` to client for resource request(attach to payload)
    console.log("Success:", newUser);
  } catch (error) {
    res.status(400).send();
    console.log("Error:", error);
  }
});
//#endregion

// @ Login Endpoint->Public (No Need authentication)
//#region Login Endpoint
router.post("/users/login", async (req, res) => {
  try {
    // TODO: Fetching User details by email and password using custom function
    const userCredential = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    // TODO: Fetching Token using userCredential using custom function
    const AuthToken = await userCredential.generateAutToken();
    res.send({
      // userCredential: userCredential.getPublicProfile(),
      userCredential,
      AuthToken,
    });
    console.log({
      // userCredential: userCredential.getPublicProfile(),
      userCredential,
      AuthToken,
    });
  } catch (error) {
    res.status(400).send("Unable to login");
    console.log("error -->", error);
  }
});
//#endregion

// @ LogOut from current device Endpoint
//#region Current device Logout route
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.authUser.tokenSet = req.authUser.tokenSet.filter((eachToken) => {
      // TODO: Removing current authorized token form "tokenSet" object by FILTERING
      return eachToken.token !== req.authToken;
      // "eachToken" -> is single object from "tokenSet" array
    });

    // TODO: Saving Current instance authorized user + sending response
    await req.authUser.save();
    res.status(200).send("Current device logged-Out!");
  } catch (error) {
    res.status(500).send();
    console.log(error);
  }
});
//#endregion

//// @ logout form all devices at once
//#region LogoutALL
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    // TODO: Removing all tokens from tokenSet -> by Nullifying
    req.authUser.tokenSet = [];

    // TODO: Saving Current instance authorized user + sending response
    await req.authUser.save();
    res.status(200).send("Logged-Out from all devices!");
  } catch (error) {
    res.status(500).send();
    console.log("error-->", error);
  }
});
//#endregion

//// User profile / Finding all Users in DB ->Need authentication
// #region User profile / Find All users + User authentication using Auth-MIDDLEWARE
router.get("/users/me", auth, async (req, res) => {
  //#region Understanding basic structure to find users

  // const users = await User.find({});
  // try {
  //   res.status(200).send(users);
  //   console.log(req.user);
  //   console.log("Found All Users Successfully! ", users);
  // } catch (error) {
  //   res.status(500).send(error);
  //   console.log("Error:", error);
  // }
  //#endregion
  try {
    // TODO: Using access variable from auth-middleware to access user from DB
    res.send(req.authUser);
  } catch (error) {
    res.status(404).send();
    console.log("Error-->", error);
  }
});
//#endregion

// ! Not required endpoint
// #region FInd UserById
// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;
//   // params -> fetches the :id from url
//   console.log("Id is : ", req.params);
//   try {
//     // TODO: Fetching User By Id
//     const userById = await User.findById(_id);

//     // TODO: Checking if user found?
//     if (!userById) {
//       console.log("User not found");
//       return res.status(404).send("Not Found");
//     }
//     // TODO: RESPONDING with user
//     res.status(200).send(userById);
//     console.log("Found UserById! :", userById);
//   } catch (error) {
//     res.status(500).send(error);
//     console.log("Internal Error, Unable to query such!", error);
//   }
// });
//#endregion

//// Updating User Endpoint ->Need authentication
// #region Update User By Id
router.patch("/users/me", auth, async (req, res) => {
  //// Errors related to : Entered update body not defined fields, miss-spelled fields
  //#region Handling Validate errors and Matching fields
  const updates = Object.keys(req.body);
  console.log(updates); // [ 'age', 'mobile' ]
  const allowedUpdates = ["name", "email", "password", "age", "phone"];
  // TODO: Checking Valid update fields
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid Update field! ",
    });
  }
  //#endregion

  try {
    //#region update user by ID(NO need)
    // console.log(req.params);
    // TODO: Fetching id from url typed
    // const _id = req.params.id;
    // const updateUserId = await User.findById(req.authUser._id); // Finds the user id

    // FIXME: updates.forEach((update) => {
    //   console.log("Each:", updateUserId[update]);
    //   updateUserId[update] = req.body[update];
    // });
    // TODO: Saving updates
    // await updateUserId.save();
    //#region
    // const updateUserId = await User.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    //#endregion
    // TODO: Checking user found?
    // if (!updateUserId) {
    //   res.status(404).send("User Not found");
    // }
    //#endregion

    //#region Updating my profile
    FIXME: updates.forEach((update) => {
      console.log("Each:", req.authUser[update]);
      req.authUser[update] = req.body[update];
    });
    // TODO: Saving updates
    await req.authUser.save();
    //#endregion

    // TODO: Responding with updated user
    res.status(200).send(req.authUser);
    console.log("updated User-->", req.authUser);
  } catch (error) {
    res.status(500).send();
    console.log("Error-->", error);
  }
});
//#endregion

//// Deleting User Endpoint ->Need authentication
//#region Deleting User
router.delete("/users/me", auth, async (req, res) => {
  try {
    //#region Need only for Deleting user by ID(No need)
    // TODO: Finding user by url id
    // const deletedUser = await User.findByIdAndDelete(req.authUser._id);

    // TODO: checking user  by id found?
    // if (!deletedUser) {
    //   res.status(404).send("User Not found");
    // }
    //#endregion

    // TODO: Removing Authenticated myself user
    await req.authUser.remove();

    // TODO: Responding with deleted user
    res.status(200).send(req.authUser);
    console.log("Deleted User-->", req.authUser);
  } catch (error) {
    res.status(400).send();
    console.log("error-->", error);
  }
});
//#endregion

////Uploading User Profile pic using "multer" package
//#region upload endpoint
const upload = multer({
  // Creating "upload" instance of multer + adding Constrains
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
      return cb(new Error("Please upload a jgp or png file less than 1Mb"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // "buffer" -> takes the file and stores the binary data of file,
    // can be accessed only when "dest" is not provided in upload multer instance
    const modImgBuffer = await sharp(req.file.buffer) //takes binary image
      .resize({ width: 250, height: 250 })
      .png() //converts any img to .png
      .toBuffer(); //png to binary(stored in buffer)
    req.authUser.avatar = modImgBuffer;
    await req.authUser.save();
    res.send("Uploaded");
  },
  // express error handling
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
//#endregion

// Deleting Avatar form profile
//#region removing avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.authUser.avatar = undefined;
    await req.authUser.save();
    res.status(200).send("Deleted");
  } catch (error) {
    res.status(400).send();
    console.log("Error-->", error);
  }
});
//#endregion

//// Fetching User Avatar by Id Endpoint
//#region Fetch User Avatar by ID
router.get("/users/:id/avatar", async (req, res) => {
  const avatarUserId = await User.findById(req.params.id);
  try {
    if (!avatarUserId || !avatarUserId.avatar) {
      throw new Error("Neither User nor avatar Found");
    }
    res.set(("Content-Type", "image/jpg"));
    res.send(avatarUserId.avatar);
  } catch (error) {
    res.status(404).send();
    console.log("Error-->", error);
  }
});

//#endregion
module.exports = router;
