const { toolSchema, toolsSchema } = require('../models/tools.model');

const  validator = async (req, res, next) => {
  const { data, bulk_write } = req.body;

  console.log(data);

  if(!bulk_write || typeof bulk_write !== 'boolean') {
    const error = {};
    error.response = {
      data: {
        message: 'bulk_write should be a boolean'
      }
    }
    return next(error)
  }

  try {
    const validatedData = bulk_write ? await toolsSchema.validateAsync(data) : await toolSchema.validateAsync(data);
    console.log(validatedData);
    if(validatedData) {
     return next();
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message
    })
  }
}

module.exports = validator;