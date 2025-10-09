const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((max, current) => {
    return current.likes > max.likes ? current : max
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Count blogs by author
  const authorCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1
    return count
  }, {})

  // Find author with most blogs
  const topAuthor = Object.keys(authorCount).reduce((max, author) => {
    return authorCount[author] > authorCount[max] ? author : max
  })

  return {
    author: topAuthor,
    blogs: authorCount[topAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Sum likes by author
  const authorLikes = blogs.reduce((likes, blog) => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
    return likes
  }, {})

  // Find author with most likes
  const topAuthor = Object.keys(authorLikes).reduce((max, author) => {
    return authorLikes[author] > authorLikes[max] ? author : max
  })

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
