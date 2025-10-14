import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error)
      window.localStorage.removeItem('loggedBlogappUser')
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification('wrong username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async blogObject => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setNotificationType('success')
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      setNotification('Error creating blog')
      setNotificationType('error')
    }
    
    setTimeout(() => {
      setNotification(null)
      setNotificationType(null)
    }, 5000)
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
    } catch {
      setNotification('Error updating blog')
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
        setNotificationType(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notification} type={notificationType} />
        {loginForm()}
      </div>
    )
  }

  const removeBlog = async (id, title, author) => {
    if (window.confirm(`Remove blog ${title} by ${author}?`)) {
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotification(`Blog '${title}' by ${author} removed`)
        setNotificationType('success')
        setTimeout(() => {
          setNotification(null)
          setNotificationType(null)
        }, 5000)
      } catch {
        setNotification('Error removing blog')
        setNotificationType('error')
        setTimeout(() => {
          setNotification(null)
          setNotificationType(null)
        }, 5000)
      }
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} type={notificationType} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} user={user} />
        )}
    </div>
  )
}

export default App