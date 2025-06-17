const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((fav, blog) => {
    return blog.likes > fav.likes ? blog : fav
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const counts = _.map(grouped, (items, author) => {
    return {
      author: author,
      blogs: items.length
    }
  })

  return _.maxBy(counts, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  
  const result = _.chain(blogs)
    .groupBy('author')
    .map((blogs, author) => ({
      author,
      likes: _.sumBy(blogs, 'likes')
    }))
    .maxBy('likes')
    .value()
  
  return result
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}