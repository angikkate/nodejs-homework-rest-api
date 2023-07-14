const { Schema, model } = require('mongoose')
const Joi = require('joi')

const { handleMongooseError } = require('../helpers')

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const subscriptionList = ['starter', 'pro', 'business']

const userSchema = new Schema({
  email: {
    type: String,
    match: emailPattern,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Set password for user'],
  },
  subscription: {
    type: String,
    enum: subscriptionList,
    default: 'starter'
  },
  token: String
}, {versionKey: false, timestaps: true})

userSchema.post('save', handleMongooseError)

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailPattern).required(),
  password: Joi.string().min(6).required(),
})

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid(...subscriptionList).required()
})

const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
}

const User = model('user', userSchema)

module.exports = {
  User,
  schemas,
}  