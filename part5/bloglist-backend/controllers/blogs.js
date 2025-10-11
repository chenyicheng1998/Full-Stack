const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog(request.body)

  blog.likes = blog.likes | 0
  blog.user = user._id

  if (!blog.title || !blog.url) {
    return response.status(400).send({ error: 'title or url missing' })
  }

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(204).end()
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())

  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes, user } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  // 只有在提供了user字段时才更新user
  if (user) {
    blog.user = user
  }

  const updatedBlog = await blog.save()

  // 返回时populate用户信息，保持与GET请求一致
  const populatedBlog = await Blog.findById(updatedBlog._id)
    .populate('user', { username: 1, name: 1, id: 1 })

  response.json(populatedBlog)
})

module.exports = blogsRouter