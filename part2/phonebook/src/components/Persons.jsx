const Person = ({ name, number }) => {
    return <p>{name}: {number}</p>
}

const Persons = ({ personsToShow }) => {
    return (
        <div>
            {personsToShow.map((person) => (
                <Person key={person.name} name={person.name} number={person.number} />
            ))}
        </div>
    )
}

export default Persons