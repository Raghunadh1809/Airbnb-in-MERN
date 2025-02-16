// Joi  == Joi is a popular data validation library in JavaScript that is often used in Express.js applications to validate incoming data such as request bodies, query parameters, and headers. It provides a flexible and intuitive API to define schemas for data validation.
// Express middleware to validate request (headers, params, query, body) using Joi

// If the schema is a joi type, the schema.validate(value) can be called directly on the type

const joi = require("joi");

// Joi uses schemas to validate data. A schema defines the structure, type, and constraints of the data you expect.
module.exports.listingschema = joi.object({
  listing: joi
    .object({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required().min(0),
      image: joi.string().allow("", null),
      location: joi.string().required(),
      country: joi.string().required(),
    })
    .required(),
});

/* When  error is Come 

{
  value: {
    listing: { title: 'I Love Apna College', price: '400', country: 'india' }
  },
  error: [Error [ValidationError]: "listing.description" is required] {
    _original: { listing: [Object] },
    details: [ [Object] ]
  }
}
*/

module.exports.reviewSchema = joi.object({
  review: joi
    .object({
      rating: joi.number().required().min(1).max(5),
      comment: joi.string().required(),
    })
    .required(),
});
