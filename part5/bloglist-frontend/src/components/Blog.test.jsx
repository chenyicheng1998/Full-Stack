import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User', username: 'testuser', id: '123' }
  }
  render(<Blog blog={blog} updateBlog={() => { }} removeBlog={() => { }} user={blog.user} />)

  const header = screen.getByText('Test Blog Test Author')
  expect(header).toBeDefined()

  const details = screen.queryByText('http://testurl.com')
  expect(details).toBeNull()

  const likes = screen.queryByText(/likes 5/)
  expect(likes).toBeNull()
})

test('shows url and likes when the view button is clicked', async () => {
  const user = userEvent.setup()

  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User', username: 'testuser', id: '123' }
  }

  render(<Blog blog={blog} updateBlog={() => { }} removeBlog={() => { }} user={blog.user} />)

  const button = screen.getByText('view')
  await user.click(button)

  const details = screen.getByText('http://testurl.com')
  expect(details).toBeDefined()

  const likes = screen.getByText(/likes 5/)
  expect(likes).toBeDefined()
})

test('if like button is clicked twice, event handler is called twice', async () => {
  const user = userEvent.setup()

  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: { name: 'Test User', username: 'testuser', id: '123' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={() => { }} user={blog.user} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
