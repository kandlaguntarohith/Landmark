const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventSchema = new Schema({
  title: String,
  body: String,
  from: Date,
  to: Date,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Event", eventSchema);
