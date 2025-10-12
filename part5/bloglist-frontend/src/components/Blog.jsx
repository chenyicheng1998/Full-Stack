import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      user: blog.user.id || blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    updateBlog(blog.id, updatedBlog)
  }

  const showRemove = user && blog.user && (blog.user.username === user.username || blog.user.id === user.id)

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-header">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} className="view-button">
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            likes {blog.likes}
            <button onClick={handleLike} className="like-button">like</button>
          </div>
          <div className="blog-user">{blog.user ? blog.user.name : 'Unknown user'}</div>
          {showRemove && (
            <button onClick={() => removeBlog(blog.id, blog.title, blog.author)} className="remove-button">
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog