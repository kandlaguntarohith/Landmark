const mongoose = require("mongoose");
// const cities = require("./cities");
const { images } = require("./images");
const { cities } = require("./indianCities");
const { places, descriptors } = require("./seedHelpers");
const landmark = require("../models/landmark");
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
const citiesSize = cities.length;
const imagesSize = images.length;
const categoriesSize = categories.length;

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

function shuffle(array) {
  var currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // await landmark.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const randomCity = Math.floor(Math.random() * citiesSize);
    const randomImages = Math.floor(Math.random() * imagesSize);
    const randomCategory = Math.floor(Math.random() * categoriesSize);
    const imgs = shuffle(images[randomImages]);
    const price = Math.floor(Math.random() * 20) + 10;
    const land = new landmark({
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      author: "60d0d354920deb473c77b690",
      category: categories[randomCategory],
      geometry: {
        type: "Point",
        coordinates: [cities[randomCity].lng, cities[randomCity].lat],
      },
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum, nunc sed tempor ornare, tellus erat luctus sapien, a maximus libero purus quis velit. Fusce semper dolor suscipit, pretium risus ac, accumsan nulla. Etiam magna dolor, venenatis nec sapien vel, convallis dapibus mauris.",
      price: price,
      images: imgs,
    });
    await land.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
