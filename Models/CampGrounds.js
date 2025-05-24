const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campSchema = new Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
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
    images: [imageSchema],
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
  },
  opts
);

campSchema.virtual("properties.popupMarker").get(function () {
  const pageLink = `/campground/${this._id}`;
  return `<h5><a href=${pageLink} style="color: black;">${this.title}</a>-</h5><h6>${this.location}</h6>`;
});

campSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({
      _id: {
        $in: camp.reviews,
      },
    });
  }
});

const CampGround = mongoose.model("CampGround", campSchema);

module.exports = CampGround;
