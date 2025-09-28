import Person from './Person'

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <ul>
      {personsToShow.map(person =>
        <Person 
          key={person.id} 
          person={person} 
          deletePerson={() => deletePerson(person.id)}
        />
      )}
    </ul>
  )
}

export default Persons