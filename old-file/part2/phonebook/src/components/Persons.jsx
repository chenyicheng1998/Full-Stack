const Person = ({ person, handleDelete }) => {
    return (
        <p>
            {person.name}: {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
        </p>
    )
}

const Persons = ({ personsToShow, handleDelete }) => {
    return (
        <div>
            {personsToShow.map((person) => (
                <Person key={person.id} person={person} handleDelete={handleDelete} />
            ))}
        </div>
    )
}

export default Persons