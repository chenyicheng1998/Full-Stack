const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [name] [number]')
  console.log('To list all entries: node mongo.js <password>')
  console.log('To add an entry: node mongo.js <password> "Some Name" 123-4567')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.mqddk7w.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}