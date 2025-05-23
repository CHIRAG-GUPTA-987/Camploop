const baseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const joiExtension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const joi = baseJoi.extend(joiExtension);

module.exports.campgroundSchema = joi.object({
  CampGround: joi
    .object({
      title: joi.string().required().escapeHTML(),
      price: joi.number().required().min(0),
      description: joi.string().required().escapeHTML(),
      location: joi.string().required().escapeHTML(),
    })
    .required(),
  deleteImages: joi.array(),
});

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      body: joi.string().required().escapeHTML(),
      rating: joi.number().required().min(1).max(5),
    })
    .required(),
});
