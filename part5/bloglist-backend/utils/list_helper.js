const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = blogs => {
  return blogs.reduce(
    (favorite, blog) => (favorite.likes > blog.likes ? favorite : blog),
    {}
  )
}

const mostBlogs = blogs => {
  if (!blogs.length) {
    return null
  }

  const blogsPerAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  let maxAuthor = Object.keys(blogsPerAuthor)[0]

  for (const author in blogsPerAuthor) {
    if (blogsPerAuthor[author] > blogsPerAuthor[maxAuthor]) {
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: blogsPerAuthor[maxAuthor]
  }
}

const mostLikes = blogs => {
  if (!blogs.length) {
    return null
  }

  const likesPerAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  let maxAuthor = Object.keys(likesPerAuthor)[0]

  for (const author in likesPerAuthor) {
    if (likesPerAuthor[author] > likesPerAuthor[maxAuthor]) {
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: likesPerAuthor[maxAuthor]
  }
}

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes
}