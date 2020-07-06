// TODO : User-Model
/**
 * @Schema Properties:
 * name
 * email
 * password
 * age
 * phone
 *
 * * For below methods never use Arrow => function
 * ^ userSchema.statics -> methods are accessible on "User" Models called as *MODEL_METHODS*
 * ^ userSchema.methods -> methods are accessible on individual user &/ instance of models called *INSTANCE_METHODS*
 *
 * # Tracking by storing generated Token -> Helps in logging out
 *  as sever sends generated token to client needs to store in DB.
 *
 * Author: punitkumaryh
 */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const Task = require("./task");

// TODO: Creating user model with schema
//#region User-Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Cannot have as password as 'password'");
        }
      },
    },
    age: {
      type: Number,
      default: 0,
      // custom validator
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be positive Number");
        }
      },
    }, // shorthand for 'age:{type:Number}'
    phone: {
      type: String,
      trim: true,
      //  Validator Library
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Invalid phone number");
        }
      },
    },
    tokenSet: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

// Implementing Mongoose Virtuals
//#region FIXME: Storing tasks virtually in User model
userSchema.virtual("ownerTasks", {
  ref: "Task", //"Task" model
  // Its relationship between "Task" and "owner"
  localField: "_id", // Its relationship between "Task" and "owner"
  foreignField: "owner",
});
//#endregion

// TODO: Fetching Public Profile (By Hiding Private data)
//#region
//#region FIXME: Logic -1
// userSchema.methods.getPublicProfile = function () {
//   const currentUser = this;
//   // Making copy of currentUser and deleting private data fields
//   const refObject = currentUser.toObject();

//   delete refObject.password;
//   delete refObject.tokenSet;
//   return refObject;
// };
//#endregion

//#region TODO: Logic -2
userSchema.methods.toJSON = function () {
  const currentUser = this;
  const userCopy = currentUser.toObject();

  delete userCopy.password;
  delete userCopy.tokenSet;
  delete userCopy.avatar;
  ``;
  return userCopy;
};
//#endregion
//#endregion

// TODO: Generating Authentication Token
//#region Token generation function
userSchema.methods.generateAutToken = async function () {
  const currentUser = this;

  const token = jwt.sign(
    {
      _id: currentUser._id.toString(),
    },
    process.env.JWT_SECRET
  );

  // # Tracking the generated Token by TODO:Storing Tokens into DB as part of document
  currentUser.tokenSet = currentUser.tokenSet.concat({ token }); //{ token } == { token:xxxx.xxxx.xxx }
  await currentUser.save();

  return token; //returns token of currentUser
};
//#endregion

// TODO: Finding user by their credentials (email and password)
//#region User Credential function
userSchema.statics.findByCredentials = async function (email, password) {
  // TODO 1. Finding User by Email
  const userDetails = await User.findOne({ email });
  if (!userDetails) {
    throw new Error("Unable to login!");
  }

  // TODO 2. Finding User by password -> only after Email match
  const isMatch = await bcrypt.compare(password, userDetails.password);
  if (!isMatch) {
    throw new Error("Unable to login!");
  }
  // console.log("user:->", userDetails);
  // console.log("Match?", isMatch);
  return userDetails;
};
//#endregion

//TODO: MIDDLEWARE -> Hashing New Created password and modified password
//#region Pre Password save Mongoose middleware
userSchema.pre("save", async function (next) {
  const currentUser = this;
  // "this" -> is current each input currentUser about to save

  // ? Checking password is already hashed + Hashing Newly created + modified passwords
  if (currentUser.isModified("password")) {
    currentUser.password = await bcrypt.hash(currentUser.password, 8);
  }

  next();
});
//#endregion

//// TODO: MIDDLEWARE -> Deleting User's tasks when user is removed
//#region deleting user's tasks
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
  next();
});
//#endregion

const User = mongoose.model("User", userSchema);
//#endregion

//// Creating User model without schema
//#region Schema-less
// const User = mongoose.model("User", {
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error("Email is invalid");
//       }
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 7,
//     trim: true,
//     validate(value) {
//       if (value.toLowerCase().includes("password")) {
//         throw new Error("Cannot have as password as 'password'");
//       }
//     },
//   },
//   age: {
//     type: Number,
//     default: 0,
//     // custom validator
//     validate(value) {
//       if (value < 0) {
//         throw new Error("Age must be positive Number");
//       }
//     },
//   }, // shorthand for 'age:{type:Number}'
//   phone: {
//     type: String,
//     trim: true,
//     //  Validator Library
//     validate(value) {
//       if (!validator.isMobilePhone(value)) {
//         throw new Error("Invalid phone number");
//       }
//     },
//   },
// });
//#endregion

module.exports = User;
