import { useState, useEffect } from 'react'
import axios from 'axios'

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const FindCountry = ({findCountry, onChange}) => {
  return (
    <h5>
      find countries<input value={findCountry} onChange={onChange} />
    </h5>
  )
}

const DisplayCountries = ({shownCountry, countries, handleManualClick}) => {

  const handleShowClick = (country) => {
    handleManualClick(country)
  }

  if(shownCountry.length > 10) {
    return (
      <h4>
        Too many matches, specify another filter
      </h4>
    )
  }
  else if(shownCountry.length > 1) {
    return (
      <div>
        {shownCountry.map(country => 
          <h4 key={country.id}>
            {country.name}
            <Button text="show" onClick={() => handleShowClick(country.name)} />
          </h4>
        )}
      </div>
    )
  }
  else if(shownCountry.length === 1) {
    const targetName = shownCountry[0].name
    let data = countries.filter(country => 
      country.name.common === targetName
    )[0]

    let languages = []
    let index = 0
    for (var prop in data.languages) {
      languages.push({language:prop, id:index})
      index++
    }
    return ( 
      <div>
        <h2>{targetName}</h2>
        <h4>capital {data.capital}<br></br>area {data.area}</h4>
        <h3 fontWeight="bold">Languages: </h3>
        <ul>
          {languages.map(language => 
            <li key={language.id}>{language.language}</li>
          )}
        </ul>
        <img src={data.flags.png}></img>
      </div>
    )
  }
  else {
    return (
      <h4>
        No result found
      </h4>
    )
  }
}

function App() {
  //State and element for handling the country searchbar
  const [countries, setCountries] = useState([])
  const [findCountry, setFindCountry] = useState("")
  const [shownCountry, setShownCountry] = useState([])

  const HandleCountryChange = (event) => {
    let target = event.target.value
    setFindCountry(target)
    let filteredCountries = countries.filter(country => 
      country.name.common.toLowerCase().indexOf(target.toLowerCase()) != -1
    )
    filteredCountries = filteredCountries.map(country => 
      country.name.common
    )
    let index = 0
    let result = []
    filteredCountries.forEach(country => {
      result.push({name:country, id: index})
      index ++
    })
    setShownCountry(result)
  }

  const handleManualClick = (country) => {
    setFindCountry(country)
    setShownCountry(
      [{
        id: 0,
        name: country
      }]
    )
  }

  //Getting the data of the countries from API.
  useEffect(() => {
    axios
    .get("https://restcountries.com/v3.1/all")
    .then(response => {
      setCountries(response.data)
    })
  }, [])

  return (
    <div>
      <FindCountry findCountry={findCountry} onChange={HandleCountryChange} />
      <DisplayCountries shownCountry={shownCountry} countries={countries}
       handleManualClick={handleManualClick} />
    </div>
  )
}

export default App;
