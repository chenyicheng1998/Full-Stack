const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByPlaceholder('title').fill(title)
  await page.getByPlaceholder('author').fill(author)
  await page.getByPlaceholder('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  
  // 等待博客创建完成
  const blogItem = page.locator('.blog', { hasText: `${title} ${author}` })
  await expect(blogItem).toBeVisible()
  return blogItem
}

const likeBlog = async (page, blogLocator, times = 1) => {
  await blogLocator.getByRole('button', { name: 'view' }).click()
  
  for (let i = 0; i < times; i++) {
    await blogLocator.getByRole('button', { name: 'like' }).click()
    await expect(blogLocator.locator('.blog-likes')).toContainText(`likes ${i + 1}`)
  }
}

const deleteBlog = async (page, blogLocator, blogTitle) => {
  await blogLocator.getByRole('button', { name: 'view' }).click()
  
  // 处理确认对话框
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain(blogTitle)
    await dialog.accept()
  })
  
  await blogLocator.getByRole('button', { name: 'remove' }).click()
  
  // 验证博客被删除
  await expect(blogLocator).toHaveCount(0)
}

const getBlogLocator = (page, title, author) => {
  return page.locator('.blog', { hasText: `${title} ${author}` })
}

const resetDatabase = async (request) => {
  await request.post('/api/testing/reset')
}

const createUser = async (request, userData) => {
  await request.post('/api/users', { data: userData })
}

export { 
  loginWith, 
  createBlog, 
  likeBlog, 
  deleteBlog, 
  getBlogLocator, 
  resetDatabase, 
  createUser 
}
