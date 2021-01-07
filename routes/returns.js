const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {Rental} = require('../../models/rentals');
const auth = require('../middleware/auth');
const {Movie} = require('../../models/movies');
const validate = require('../middleware/validate');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.bod.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');

  if(rental.dateReturned) return res.status(400).send('Return already processed');

  rental.return();
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.status(200).send(rental);

});

function validateReturn(req) {
  const schema = Joi.object({
      customerId: Joi.objectId().required(),
      movieId: Joi.objectId().required()
  });

  return schema.validate(genre);
};

module.exports = router;