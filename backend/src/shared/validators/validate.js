const { ZodError } = require('zod');
const ValidationError = require('../errors/ValidationError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const err = new ValidationError('Validation Error', error.errors);
      return next(err);
    }
    next(error);
  }
};

module.exports = validate;
