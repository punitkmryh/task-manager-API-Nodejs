const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;

Connect_url = process.env.MONGODB_URL;
mongoose.connect(Connect_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
