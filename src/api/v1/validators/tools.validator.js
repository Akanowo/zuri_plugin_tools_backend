const toolsSchema = require('../models/tools.model');

const validator = (req, res) => {
  const { tools } = req.body;

  try {
    const validatedData = await toolsSchema.validateAsync(tools);
    if(validatedData) {
      next();
    }
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: error.message
    })
  }
}

module.exports = validator;