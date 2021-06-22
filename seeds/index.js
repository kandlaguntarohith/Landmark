const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const landmark = require("../models/landmark");
require("dotenv").config();
const db_url = process.env.DB_URL;
mongoose.connect(db_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await landmark.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const land = new landmark({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: "60ccd0a7aef2b400155e3a20",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum, nunc sed tempor ornare, tellus erat luctus sapien, a maximus libero purus quis velit. Fusce semper dolor suscipit, pretium risus ac, accumsan nulla. Etiam magna dolor, venenatis nec sapien vel, convallis dapibus mauris. Donec eu viverra est. Aliquam auctor hendrerit enim, vitae iaculis tellus fermentum at. Nunc eros nibh, rutrum quis est ut, malesuada suscipit sapien. In hac habitasse platea dictumst. Nullam tincidunt nunc metus, ut aliquam sapien interdum at.",
      price: price,
      images: [
        {
          url: "https://res.cloudinary.com/rohithreddy/image/upload/v1623663136/Landmark/aboh0uinl1fg7rv9othr.jpg",
          filename: "Landmark/aboh0uinl1fg7rv9othr",
        },
        {
          url: "https://res.cloudinary.com/rohithreddy/image/upload/v1623663136/Landmark/habkqa4tjpu6gljp6axo.jpg",
          filename: "Landmark/habkqa4tjpu6gljp6axo",
        },
        {
          url: "https://res.cloudinary.com/rohithreddy/image/upload/v1623663136/Landmark/zzkd0gb4x2rfvcnvzjg1.jpg",
          filename: "Landmark/zzkd0gb4x2rfvcnvzjg1",
        },
      ],
    });
    await land.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
