import { useState, useEffect } from 'react'
import axios from 'axios'



const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    const capital = country.capital[0]
    const lat = country.capitalInfo.latlng[0]
    const lon = country.capitalInfo.latlng[1]

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [country, api_key])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area} km²</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200" />

      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {weather.main.temp} °C</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}




const CountryList = ({ countries, handleShow }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  } else if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => handleShow(country.name.common)}>show</button>
          </div>
        ))}
      </div>
    )
  } else if (countries.length === 1) {
    return <CountryDetail country={countries[0]} />
  } else {
    return <p>No matches</p>
  }
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const results = countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
    setFilteredCountries(results)
  }, [filter, countries])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShow = (countryName) => {
    setFilter(countryName)
  }

  return (
    <div>
      <div>
        find countries: <input value={filter} onChange={handleFilterChange} />
      </div>
      <CountryList countries={filteredCountries} handleShow={handleShow} />
    </div>
  )
}

export default App
