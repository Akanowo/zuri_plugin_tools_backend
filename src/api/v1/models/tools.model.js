const Joi = require('joi');

const toolsSchema = Joi.array().items(Joi.object({
  name: Joi.string().max(30).min(2).required(),
  languages: Joi.array().items(Joi.string()).required(),
  pricing: Joi.string(),
  categories: Joi.array().items(Joi.string()),
  description: Joi.object({
    about: Joi.string(),
    list: Joi.array().items(Joi.string())
  }),
  organization_id: Joi.string().required()
}))

module.exports = toolsSchema;