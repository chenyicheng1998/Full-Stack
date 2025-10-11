const { after, beforeEach, describe, test } = require('node:test')
const app = require('../app')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('users', () => {
  beforeEach(async () => {
    // Only clean specific test users, not the blog test user
    await User.deleteMany({ username: { $in: ['newuser', 'root', 'testuser2'] } })

    // Create a root user for some tests
    const rootUser = {
      name: 'Root User',
      username: 'root',
      password: 'rootpassword'
    }
    await api.post('/api/users').send(rootUser)
  })

  test('a valid user can be added', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'test123'
    }

    const usersAtStart = await helper.usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, newUser.username)
    assert.strictEqual(response.body.name, newUser.name)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test('user without username is not added', async () => {
    const newUser = {
      name: 'New User',
      password: 'test123'
    }

    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user without password is not added', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User'
    }

    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user is not added if password length is 2 characters', async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'pw'
    }

    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user is not added if username length is 2 characters', async () => {
    const newUser = {
      username: 'nu',
      name: 'New User',
      password: 'password'
    }

    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test("same username can't be added twice", async () => {
    const newUser = {
      username: 'newuser',
      name: 'New User',
      password: 'test123'
    }

    await api.post('/api/users').send(newUser)

    const usersAtStart = await helper.usersInDb()

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  after(() => {
    mongoose.connection.close()
  })
})