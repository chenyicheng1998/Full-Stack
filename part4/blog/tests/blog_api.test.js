const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token
let userId

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 10
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create a test user
  const passwordHash = await bcrypt.hash('secret', 10)
  const testUser = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  })
  const savedUser = await testUser.save()
  userId = savedUser._id

  // Get token for the test user
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'secret'
    })

  token = loginResponse.body.token

  // Create initial blogs associated with the test user
  const blogsWithUser = initialBlogs.map(blog => ({
    ...blog,
    user: userId
  }))
  await Blog.insertMany(blogsWithUser)
})

test('blogs are returned as json and correct amount', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogs = response.body
  console.log('Blogs:', blogs)
  if (blogs.length < 1) {
    throw new Error('Expected at least one blog')
  }
})

test('blog posts have a unique identifier property named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.id, 'id field is missing')
    assert.strictEqual(typeof blog.id, 'string')
  })
})

describe('adding a new blog', () => {
  test('succeeds with valid data and token', async () => {
    const newBlog = {
      title: 'Newly added blog',
      author: 'Author Three',
      url: 'http://example.com/3',
      likes: 15
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    if (response.body.length !== initialBlogs.length + 1) {
      throw new Error(`Expected ${initialBlogs.length + 1} blogs, got ${response.body.length}`)
    }

    if (!titles.includes('Newly added blog')) {
      throw new Error('New blog title not found')
    }
  })

  test('fails with status code 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Blog without token',
      author: 'Author Four',
      url: 'http://example.com/4',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await api.get('/api/blogs')
    if (blogsAtEnd.body.length !== initialBlogs.length) {
      throw new Error('Blog should not be added without token')
    }
  })

  test('fails with status code 401 if token is invalid', async () => {
    const newBlog = {
      title: 'Blog with invalid token',
      author: 'Author Five',
      url: 'http://example.com/5',
      likes: 5
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'Bearer invalidtoken')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await api.get('/api/blogs')
    if (blogsAtEnd.body.length !== initialBlogs.length) {
      throw new Error('Blog should not be added with invalid token')
    }
  })

  test('if likes property is missing, it will default to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author Four',
      url: 'http://example.com/4'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    if (response.body.likes !== 0) {
      throw new Error(`Expected likes to be 0, got ${response.body.likes}`)
    }
  })
})

describe('deleting a blog', () => {
  test('succeeds with status code 204 if id is valid and user owns the blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 401 if token is not provided', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const nonExistentId = '5a422aa71b54a676234d17f8'

    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://updated.com',
      likes: 999
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = response.body
    assert.strictEqual(updatedBlog.title, updatedData.title)
    assert.strictEqual(updatedBlog.author, updatedData.author)
    assert.strictEqual(updatedBlog.url, updatedData.url)
    assert.strictEqual(updatedBlog.likes, updatedData.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})