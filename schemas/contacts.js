const Joi = require('joi')

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phonePattern = /^[0-9]{10}$/

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailPattern).required(),
  phone: Joi.string().pattern(phonePattern).required()
})

module.exports = {
  addSchema, 
}