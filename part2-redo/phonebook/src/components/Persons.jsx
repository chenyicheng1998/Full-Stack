import Person from './Person'

const Persons = ({ personsToShow }) => {
  return (
    <ul>
      {personsToShow.map(person =>
        <Person key={person.id} person={person} />
      )}
    </ul>
  )
}

export default Persons