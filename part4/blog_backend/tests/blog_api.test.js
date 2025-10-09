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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map((b) => b.title)
  assert(titles.includes('Test Blog'))

  const authors = blogsAtEnd.map((b) => b.author)
  assert(authors.includes('Test Author'))

  const savedBlog = blogsAtEnd.find(blog => blog.title === 'Test Blog')
  assert.strictEqual(savedBlog.title, newBlog.title)
  assert.strictEqual(savedBlog.author, newBlog.author)
  assert.strictEqual(savedBlog.url, newBlog.url)
  assert.strictEqual(savedBlog.likes, newBlog.likes)
})

test('blog without likes property defaults to 0', async () => {
  const newBlog = {
    title: 'Test Blog Without Likes',
    author: 'Test Author',
    url: 'http://test.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const savedBlog = blogsAtEnd.find(blog => blog.title === 'Test Blog Without Likes')

  assert.strictEqual(savedBlog.likes, 0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    likes: 5,
  }

  await api.post('/api/blogs').send(newBlog).expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})