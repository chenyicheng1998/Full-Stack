const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map((r) => r.title)
  assert(titles.includes('React patterns'))
})

test('the unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const blogs = response.body
  assert(blogs.length > 0)

  blogs.forEach(blog => {
    assert(blog.id !== undefined)
    assert(blog._id === undefined)
  })
})

after(async () => {
  await mongoose.connection.close()
})