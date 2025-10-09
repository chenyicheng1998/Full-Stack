const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'test',
    url: 'http://test.com'
  })
  await blog.save()
  await blog.deleteOne()

  return blog.id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getToken = async (username = 'testuser') => {
  const user = await User.findOne({ username })
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 })
}

const getExpiredToken = async (username = 'testuser') => {
  const user = await User.findOne({ username })
  const userForToken = {
    username: user.username,
    id: user._id,
  }
  // Create a token that expires in 1 second for testing
  return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 1 })
}

const createTestUser = async () => {
  const passwordHash = await bcrypt.hash('password', 10)
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  })
  return await user.save()
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  getToken,
  getExpiredToken,
  createTestUser,
}