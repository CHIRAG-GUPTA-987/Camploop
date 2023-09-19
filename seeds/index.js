const mongoose = require("mongoose");
const CampGround = require("../Models/CampGrounds");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect("mongodb+srv://Chirag987:qw12QWPO@cluster-cg.861by.mongodb.net/campDB?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((e) => {
    console.log("Not connecting to Database");
  });

const getTitle = (list) => list[Math.floor(Math.random() * list.length)];

const rootCampGrounds = async () => {
  await CampGround.deleteMany({});
  for (let i = 0; i < 500; i++) {
    const randomPrice = Math.floor(Math.random() * 100);
    const randomCity = Math.floor(Math.random() * cities.length);
    const newCamp = new CampGround({
      author: "650704bd29e050695abf0a9f",
      title: `${getTitle(descriptors)} ${getTitle(places)}`,
      location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[randomCity].longitude,
          cities[randomCity].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dxgbebpzs/image/upload/v1650914590/YELPCAMPCG/eo9mduss5j73ypsqoyqi.jpg",
          filename: "YELPCAMPCG/zg3xovn5noscizu9vz43",
        },
      ],
      price: randomPrice,
      description:
        "This campground is amazing and full of natural vibes. Here all the facilities are available such as transport, restaurants and much more. You always feel very excited when you visit this place.",
    });
    await newCamp.save();
  }
};

rootCampGrounds().then(() => {
  mongoose.connection.close();
});
