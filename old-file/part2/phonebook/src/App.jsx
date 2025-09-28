import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import personService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        personService
          .update(existingPerson.id, personObject)
          .then(updatedPerson => {
            setPersons(persons.map(p =>
              p.id !== existingPerson.id ? p : updatedPerson
            ))
            setMessage({ text: `Updated ${newName}'s number`, type: 'success' })
            setTimeout(() => setMessage(null), 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setMessage({ text: `Information of ${newName} has already been removed from server`, type: 'error' })
            setTimeout(() => setMessage(null), 5000)
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setMessage({ text: `Added ${newName}`, type: 'success' })
          setTimeout(() => setMessage(null), 5000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setMessage({ text: `Deleted ${name}`, type: 'success' })
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(error => {
          setMessage({ text: `Information of ${name} has already been removed from server`, type: 'error' })
          setTimeout(() => setMessage(null), 5000)
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App