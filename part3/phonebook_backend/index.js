require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person') // 引入 Person 模型

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// 获取所有条目 - 已修改为从数据库获取
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// 获取信息页 - 暂时保持不变
app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const requestTime = new Date()
    const content = `
      <p>Phonebook has info for ${count} people</p>
      <p>${requestTime}</p>`
    response.send(content)
  })
})

// 获取单个条目 - 暂时保持不变 (将在后续练习中修改)
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

// 删除条目 - 暂时保持不变 (将在后续练习中修改)
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  // 这部分逻辑将在后续练习中更新为数据库操作
  response.status(501).send({ error: 'delete not implemented yet' })
})

// 添加新条目 - 已修改为保存到数据库
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing',
    })
  }

  // 注意：根据要求，暂时不检查姓名是否重复

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})