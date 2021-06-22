const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const { cloudinary } = require("../cloudinary/index");
const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/c_scale,h_200,q_auto,r_0,w_300");
});
ImageSchema.virtual("cover").get(function () {
  return this.url.replace("/upload", "/upload/c_scale,h_400,q_auto,r_0,w_600");
});

const landmarkSchema = new Schema(
  {
    title: String,
    price: Number,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  }
  // opts
);
landmarkSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href="/landmarks/${this._id}">${this.title}</a><strong>
  <p>${this.description.substring(0, 20)}...</p>`;
});

landmarkSchema.post("findOneAndDelete", async (data) => {
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

landmarkSchema.post("findOneAndDelete", async function (landmark) {
  if (landmark.reviews) {
    await Review.deleteMany({
      _id: { $in: landmark.reviews },
    });
  }
  if (landmark.images) {
    for (const img of landmark.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});
module.exports = mongoose.model("landmark", landmarkSchema);
