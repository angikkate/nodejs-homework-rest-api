const {Contact} = require('../models/contact')
const {HttpError, ctrlWrapper} = require('../helpers')

const listContacts = async (req, res, next) => {
  const { _id: owner } = req.user
  const { page = 1, limit = 20, favorite } = req.query
  const skip = (page - 1) * limit
  const query = { owner }

  if (favorite) {
    query.favorite = favorite === 'true';
  }
  
  const result = await Contact.find(query, '-createdAt -updatedAt', { skip, limit }).populate('owner', 'email')
  res.json(result)
}

const getContactById = async (req, res, next) => {
  const { contactId } = req.params 
  const result = await Contact.findById(contactId)
  if(!result) {
    throw HttpError(404, 'Not found')
  }
  res.json(result)
}

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user
  const result = await Contact.create({...req.body, owner})
  res.status(201).json(result)
}

const removeContact = async (req, res, next) => {
  const { contactId } = req.params
  const result = await Contact.findByIdAndRemove(contactId)
  if(!result) {
    throw HttpError(404, 'Not found')
  }
  res.json({
    message: 'Contact deleted'
  }) 
}

const updateContact = async (req, res, next) => {
  const { contactId } = req.params
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
  if(!result) {
    throw HttpError(404, 'Not found')
  }
  res.json(result)
}

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
  if(!result) {
    throw HttpError(404, 'Not found')
  }
  res.json(result)
}

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
}