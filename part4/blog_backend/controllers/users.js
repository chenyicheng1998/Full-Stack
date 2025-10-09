const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validate username and password requirements
  if (!username || !password) {
    return response.status(400).json({
      error: 'Both username and password must be given'
    })
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: 'Username must be at least 3 characters long'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError') {
      response.status(400).json({ error: error.message })
    } else if (error.code === 11000) {
      response.status(400).json({ error: 'Username must be unique' })
    } else {
      response.status(500).json({ error: 'Internal server error' })
    }
  }
})

module.exports = usersRouter