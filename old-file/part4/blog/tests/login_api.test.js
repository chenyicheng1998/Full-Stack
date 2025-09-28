const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ 
      username: 'testuser', 
      name: 'Test User',
      passwordHash 
    })

    await user.save()
  })

  test('succeeds with valid credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'secret'
    }

    const result = await api
      .post('/api/login')
      .send(loginData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.token)
    assert.strictEqual(result.body.username, 'testuser')
    assert.strictEqual(result.body.name, 'Test User')
  })

  test('fails with invalid credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'wrongpassword'
    }

    const result = await api
      .post('/api/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })

  test('fails with non-existent user', async () => {
    const loginData = {
      username: 'nonexistent',
      password: 'password'
    }

    const result = await api
      .post('/api/login')
      .send(loginData)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('invalid username or password'))
  })
})

after(async () => {
  await mongoose.connection.close()
})