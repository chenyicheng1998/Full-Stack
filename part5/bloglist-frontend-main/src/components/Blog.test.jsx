import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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