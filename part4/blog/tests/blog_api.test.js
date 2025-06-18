const { test, describe, beforeEach, after } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

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
  await Blog.insertMany(initialBlogs)
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

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Newly added blog',
    author: 'Author Three',
    url: 'http://example.com/3',
    likes: 15
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)  // Created
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  // Check that total number increased by 1
  if (response.body.length !== initialBlogs.length + 1) {
    throw new Error(`Expected ${initialBlogs.length + 1} blogs, got ${response.body.length}`)
  }

  // Check that the new blog's title is in the list
  if (!titles.includes('Newly added blog')) {
    throw new Error('New blog title not found')
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
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  if (response.body.likes !== 0) {
    throw new Error(`Expected likes to be 0, got ${response.body.likes}`)
  }
})

test('blog without title is not added and returns 400', async () => {
  const newBlog = {
    author: 'No Title Author',
    url: 'http://example.com/no-title',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await api.get('/api/blogs')
  if (blogsAtEnd.body.length !== initialBlogs.length) {
    throw new Error('Blog without title should not be added')
  }
})

test('blog without url is not added and returns 400', async () => {
  const newBlog = {
    title: 'No URL Blog',
    author: 'No URL Author',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await api.get('/api/blogs')
  if (blogsAtEnd.body.length !== initialBlogs.length) {
    throw new Error('Blog without url should not be added')
  }
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

  const titles = blogsAtEnd.body.map(r => r.title)
  assert(!titles.includes(blogToDelete.title))
})

test('deleting a non-existent blog returns 404', async () => {
  const nonExistentId = '5a422aa71b54a676234d17f8' // Valid format but doesn't exist

  await api
    .delete(`/api/blogs/${nonExistentId}`)
    .expect(404)
})

test('deleting with invalid id format returns 400', async () => {
  const invalidId = 'invalid-id-format'

  await api
    .delete(`/api/blogs/${invalidId}`)
    .expect(400)
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

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const nonExistentId = '5a422aa71b54a676234d17f8' // Valid format but doesn't exist
    const updatedData = {
      title: 'Will Not Update',
      likes: 100
    }

    await api
      .put(`/api/blogs/${nonExistentId}`)
      .send(updatedData)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = 'invalid-id-format'
    const updatedData = {
      title: 'Will Not Update',
      likes: 100
    }

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedData)
      .expect(400)
  })

  test('updating only likes succeeds when other fields are missing', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = {
      likes: 123
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    const updatedBlog = response.body
    assert.strictEqual(updatedBlog.title, blogToUpdate.title) // remains unchanged
    assert.strictEqual(updatedBlog.author, blogToUpdate.author) // remains unchanged
    assert.strictEqual(updatedBlog.url, blogToUpdate.url) // remains unchanged
    assert.strictEqual(updatedBlog.likes, updatedData.likes) // updated
  })
})

after(async () => {
  await mongoose.connection.close()
})