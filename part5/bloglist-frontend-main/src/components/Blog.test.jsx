import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'

const blog = {
  id: '1',
  title: 'Component testing is done with react-testing-library',
  author: 'Test Author',
  url: 'http://test.com',
  likes: 5,
  user: {
    id: '1',
    name: 'Test User',
    username: 'testuser'
  }
}

const user = {
  name: 'Test User',
  username: 'testuser',
  token: 'test-token'
}

test('renders title and author but not URL or likes by default', () => {
  render(
    <Blog
      blog={blog}
      updateBlog={() => { }}
      deleteBlog={() => { }}
      user={user}
    />
  )

  // Check that title and author are displayed
  const titleAuthor = screen.getByText('Component testing is done with react-testing-library Test Author')
  expect(titleAuthor).toBeDefined()

  // Check that URL and likes are not displayed by default
  const urlElement = screen.queryByText('http://test.com')
  expect(urlElement).toBeNull()

  const likesElement = screen.queryByText('likes 5')
  expect(likesElement).toBeNull()
})

test('shows URL and likes when view button is clicked', async () => {
  const { container } = render(
    <Blog
      blog={blog}
      updateBlog={() => { }}
      deleteBlog={() => { }}
      user={user}
    />
  )

  const userEventInstance = userEvent.setup()
  const button = screen.getByText('view')
  await userEventInstance.click(button)

  // Check that URL and likes are now displayed
  expect(screen.getByText('http://test.com')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()
})

test('clicking like button twice calls event handler twice', async () => {
  const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      updateBlog={mockHandler}
      deleteBlog={() => { }}
      user={user}
    />
  )

  const userAgent = userEvent.setup()

  // First click view button to show details
  const viewButton = screen.getByText('view')
  await userAgent.click(viewButton)

  // Then click like button twice
  const likeButton = screen.getByText('like')
  await userAgent.click(likeButton)
  await userAgent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})