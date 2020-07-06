// TODO : Task-Model
/**
 * @Schema Properties:
 * description
 * completed
 *
 * ! Mongoose VIRTUAL ->
 *  a virtual is a property that is not stored in MongoDB.
 *  Virtuals are typically used for computed properties on documents.
 *
 * Author: punitkumaryh
 */
const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

//// Creating instance Schema
//#region task-Schema
const taskSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      // $$ "ref" reference the User model to access User details in task model
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const task = mongoose.model("Task", taskSchema);
//#endregion

//// Creating instance without schema
//#region task schema-less
// const task = mongoose.model("Task", {
//   description: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
// });
//#endregion

module.exports = task;
