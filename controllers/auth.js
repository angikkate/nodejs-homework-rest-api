const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require("gravatar")
const path = require("path")
const fs = require("fs/promises")
const Jimp = require('jimp')

const { User } = require('../models/user')

const { HttpError, ctrlWrapper } = require('../helpers')

const { SECRET_KEY } = process.env

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars')

const register = async(req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({email})

  if(user){
    throw HttpError(409, 'Email in use')
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const avatarURL = gravatar.url(email)

  const newUser = await User.create({...req.body, password: hashPassword, avatarURL});

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    }
  })
}

const login = async(req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({email})
  if(!user){
    throw HttpError(401, 'Email or password invalid')
  }
  const passwordCompare = await bcrypt.compare(password, user.password)
  if(!passwordCompare){
    throw HttpError(401, 'Email or password is wrong')
  }

  const payload = {
    id: user._id,
  }

  const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'})
  await User.findByIdAndUpdate(user._id, {token});

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    }
  })
}

const getCurrent = async(req, res)=> {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  })
}

const logout = async(req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, {token: ''});

  res.json({
      message: 'Logout success'
  })
}

const subscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription: newSubscription } = req.body
  
  const validSubscriptions = ['starter', 'pro', 'business']
  if (!validSubscriptions.includes(newSubscription)) {
    throw HttpError(400, 'Invalid subscription value')
  }
  
  const result = await User.findByIdAndUpdate(_id, req.body, {new: true})
  
  res.json(result)
}

const updateAvatar = async(req, res)=> {
  const { _id } = req.user
  const { path: tempUpload, originalname } = req.file
  const filename = `${_id}_${originalname}`
  const resultUpload = path.join(avatarsDir, filename)

  const image = await Jimp.read(tempUpload)
  await image.cover(250, 250).write(resultUpload)

  await fs.rename(tempUpload, resultUpload)
  const avatarURL = path.join('avatars', filename)
  await User.findByIdAndUpdate(_id, {avatarURL})

  res.json({
      avatarURL,
  })
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(subscription),
  updateAvatar: ctrlWrapper(updateAvatar),
}