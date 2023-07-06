const {Schema, model} = require('mongoose')
const Joi = require('joi')

const {handleMongooseError} = require('../helpers')

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
})

contactSchema.post('save', handleMongooseError)

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phonePattern = /^\(\d{3}\) \d{3}-\d{4}$/

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailPattern).required(),
  phone: Joi.string().pattern(phonePattern).required(),
  favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})

const schemas = {
    addSchema,
    updateFavoriteSchema,
}

const Contact = model('contact', contactSchema)

module.exports = {
  Contact,
  schemas,
}  