const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create a test user first
    await helper.createTestUser()

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

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const token = await helper.getToken()

      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
      const token = await helper.getToken()

      const newBlog = {
        title: 'Test Blog Without Likes',
        author: 'Test Author',
        url: 'http://test.com',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const savedBlog = blogsAtEnd.find(blog => blog.title === 'Test Blog Without Likes')

      assert.strictEqual(savedBlog.likes, 0)
    })

    test('fails with status code 400 if title is missing', async () => {
      const token = await helper.getToken()

      const newBlog = {
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 400 if url is missing', async () => {
      const token = await helper.getToken()

      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is missing', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is invalid', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer invalid_token')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status code 401 if token is expired', async () => {
      const expiredToken = await helper.getExpiredToken()

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newBlog = {
        title: 'Test Blog with Expired Token',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${expiredToken}`)
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlogData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1
      }

      const result = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(result.body.likes, blogToUpdate.likes + 1)
      assert.strictEqual(result.body.title, blogToUpdate.title)
      assert.strictEqual(result.body.author, blogToUpdate.author)
      assert.strictEqual(result.body.url, blogToUpdate.url)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)
    })

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()

      const updatedBlogData = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5
      }

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(updatedBlogData)
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})