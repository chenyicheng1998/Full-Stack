const { test, describe, expect, beforeEach } = require('@playwright/test')
const { 
  loginWith, 
  createBlog, 
  likeBlog, 
  deleteBlog, 
  getBlogLocator, 
  resetDatabase, 
  createUser 
} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await resetDatabase(request)
    await createUser(request, {
      name: 'Test User',
      username: 'testuser',
      password: 'secret'
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'secret')
      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testuser', 'wrong')

      const errorDiv = page.locator('.notification.error')
      await expect(errorDiv).toContainText('wrong username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testuser', 'secret')
    })

    test('a new blog can be created', async ({ page }) => {
      const title = 'E2E testing with Playwright'
      const author = 'Playwright'

      await createBlog(page, title, author, 'http://example.com')
    })

    test('a blog can be liked', async ({ page }) => {
      const title = 'Blog to like'
      const author = 'Like Author'

      const blogItem = await createBlog(page, title, author, 'http://like.example')
      await likeBlog(page, blogItem, 1)
    })

    test('the creator can delete the blog', async ({ page }) => {
      const title = 'Blog to delete'
      const author = 'Delete Author'

      const blogItem = await createBlog(page, title, author, 'http://delete.example')
      await deleteBlog(page, blogItem, title)
    })

    test('blogs are ordered by likes with most liked first', async ({ page }) => {
      // create multiple blogs with different like counts
      const blogs = [
        { title: 'Blog with 5 likes', author: 'Author A', url: 'http://blog5.com', likes: 5 },
        { title: 'Blog with 10 likes', author: 'Author B', url: 'http://blog10.com', likes: 10 },
        { title: 'Blog with 3 likes', author: 'Author C', url: 'http://blog3.com', likes: 3 }
      ]

      // create blogs and add likes
      for (const blog of blogs) {
        const blogItem = await createBlog(page, blog.title, blog.author, blog.url)
        await likeBlog(page, blogItem, blog.likes)
      }

      // verify the order: blogs should be sorted by likes (highest first)
      const allBlogs = page.locator('.blog')
      
      // check that the first blog is the one with 10 likes
      await expect(allBlogs.nth(0)).toContainText('Blog with 10 likes Author B')
      
      // check that the second blog is the one with 5 likes  
      await expect(allBlogs.nth(1)).toContainText('Blog with 5 likes Author A')
      
      // check that the third blog is the one with 3 likes
      await expect(allBlogs.nth(2)).toContainText('Blog with 3 likes Author C')
    })

    test('only the creator sees the remove button', async ({ page, request }) => {
      const title = 'Creator only blog'
      const author = 'Owner'

      // create a blog as the first user
      const blogItem = await createBlog(page, title, author, 'http://creator.example')

      // expand details and ensure remove is visible for the creator
      await blogItem.getByRole('button', { name: 'view' }).click()
      await expect(blogItem.getByRole('button', { name: 'remove' })).toBeVisible()

      // logout
      await page.getByRole('button', { name: 'logout' }).click()

      // create a different user via API
      await createUser(request, {
        name: 'Other User',
        username: 'otheruser',
        password: 'sekret'
      })

      // login as the other user via UI
      await loginWith(page, 'otheruser', 'sekret')

      await expect(page.getByText('Other User logged in')).toBeVisible()

      // find the same blog and open details
      const otherView = getBlogLocator(page, title, author)
      await expect(otherView).toBeVisible()
      await otherView.getByRole('button', { name: 'view' }).click()

      // the remove button should NOT be visible to this user
      await expect(otherView.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })
  })
})
