// const express = require("express");
const Landmark = require("../models/landmark");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const categories = [
  "hotel",
  "restaurant",
  "cricket",
  "football",
  "school",
  "gym",
  "beach",
  "trek",
];

module.exports.renderNewlandmark = (req, res) => {
  res.render("landmarks/new", { categories });
};

module.exports.renderShowlandmark = async (req, res) => {
  const landmark = await Landmark.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!landmark) {
    req.flash("error", "landmark not found !!");
    res.redirect("/landmarks");
  }
  res.render("landmarks/show", { landmark });
};

module.exports.renderEditlandmark = async (req, res) => {
  const landmark = await Landmark.findById(req.params.id);
  if (!landmark) {
    req.flash("error", "landmark not found !!");
    res.redirect("/landmarks");
  }
  res.render("landmarks/edit", { landmark, categories });
};

module.exports.putlandmark = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.landmark.location,
      limit: 1,
    })
    .send();
  const landmark = await Landmark.findByIdAndUpdate(
    req.params.id,
    req.body.landmark
  );
  // landmark.geometry = geoData.body.features[0].geometry;
  if (!landmark) {
    req.flash("error", "landmark not found !!");
    res.redirect("/landmarks");
  }
  const images = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });
  landmark.geometry = geoData.body.features[0].geometry;
  landmark.images.push(...images);
  await landmark.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await Landmark.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated a landmark !");
  res.redirect(`/landmarks/${landmark._id}`);
};

module.exports.deletelandmark = async (req, res) => {
  await Landmark.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted landmark !");
  res.redirect("/landmarks");
};

module.exports.postlandmark = async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.landmark.location,
      limit: 1,
    })
    .send();

  const landmark = new Landmark(req.body.landmark);
  landmark.geometry = geoData.body.features[0].geometry;

  landmark.images = req.files.map((file) => {
    return { url: file.path, filename: file.filename };
  });

  landmark.author = req.user._id;
  const data = await landmark.save();

  req.flash("success", "Successfully created a landmark !");
  res.redirect(`/landmarks/${data._id}`);
};
module.exports.renderAlllandmarks = async (req, res) => {
  const { search, category = "all" } = req.query;
  const query = {};
  if (search) query.title = { $regex: ".*" + search + ".*" };
  if (category !== "all") query.category = category;
  const landmarks = await Landmark.find(query);
  // console.log(category);

  res.render("landmarks/index", {
    landmarks,
    search,
    category,
    categories: ["all", ...categories],
  });
};
