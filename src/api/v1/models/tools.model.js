const Joi = require('joi');

const toolsSchema = Joi.array().items(Joi.object({
  name: Joi.string().max(30).min(2).required(),
  logo: Joi.string().uri(),
  languages: Joi.array().items(Joi.string()).required(),
  pricing: Joi.string().allow(''),
  categories: Joi.array().items(Joi.string()),
  description: Joi.object({
    about: Joi.string(),
    list: Joi.array().items(Joi.string())
  }).required()
}))

const toolSchema = Joi.object({
  name: Joi.string().max(30).min(2).required(),
  logo: Joi.string().uri(),
  languages: Joi.array().items(Joi.string()).required(),
  pricing: Joi.string().allow(''),
  categories: Joi.array().items(Joi.string()),
  description: Joi.object({
    about: Joi.string(),
    list: Joi.array().items(Joi.string())
  }).required()
})

module.exports = { toolsSchema, toolSchema };