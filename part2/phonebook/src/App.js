import { useState, useEffect } from 'react'
import axios from 'axios'

const baseURL = "https://safe-shore-73002.herokuapp.com"

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}


const AlertSuccess = ({success, contact, setSuccess}) => {
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setSuccess(false)
      console.log("executed")
    }, 5000)

    return () => {
      clearTimeout(timeId)
    }
  }, [success]);

  const style = {
    textAlign: 'center',
    border: '3px solid green',
    backgroundColor: 'lightgreen'
  }

  if(success) {
    return (
      <div style={style}>
        <p>Added {contact}</p> 
      </div>
    )
  }
  else {
    return (
      <>
      </>
    )
  }
}

const AlertFail = ({fail, contact, setFail, message}) => {
  useEffect(() => {
    const timeId = setTimeout(() => {
      // After 3 seconds set the show value to false
      setFail(false)
      console.log("executed")
    }, 5000)

    return () => {
      clearTimeout(timeId)
    }
  }, [fail]);

  const style = {
    textAlign: 'center',
    border: '3px solid red',
    backgroundColor: 'lightred'
  }

  if(fail) {
    return (
      <div style={style}>
        <p>{contact} {message}</p> 
      </div>
    )
  }
  else {
    return (
      <>
      </>
    )
  }
}

const Filter = ({filter, onChange}) => {
  return (
    <div>
       filter shown with <input value={filter} onChange={onChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addNewContact}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({contacts, handleDeleteClick}) => {
  return (
    <div>
      <h3>Numbers</h3>
      {contacts.map(contact =>
        <h4 key={contact.id}>
          {contact.name} {contact.number}
          <Button text="delete" onClick={() => handleDeleteClick(contact.id)} />
        </h4>
      )
      }
    </div>
  )
}

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [recentAdded, setRecentAdded] = useState('')
  const [contacts, setContacts] = useState([])
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)
  const [error, setError] = useState("")

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }


  const addNewContact = (event) => {
    event.preventDefault()
    
    setRecentAdded(newName)
    let exist = false
    let currContact = null
    contacts.forEach(contact => {
      if(contact.name === newName) {
        exist = true
        currContact = contact
      }
    })
    if(!exist) {
      const newContact = {
        name: newName,
        number: newNumber,
      }

      // Sending data to update the server
      axios
      .post(baseURL + "/api/persons", newContact)
      .then(response => {
        setContacts(contacts.concat(response.data))
        setNewName("")
        setNewNumber("")
        setSuccess(true)
      })
      .catch(error => {
        setFail(true)
        console.log(error)
        setError(error.response.data.error)
      })
    }
    else {
      let decision = window.confirm(newName + ' is already added to phonebook, replace the old number with a new one?')
      if(decision) {
        const newContact = {...currContact, number: newNumber}
        axios
        .put(`${baseURL}/api/persons/${newContact.id}`, newContact)
        .then(response => {
          setContacts(contacts.map(contact => contact.id !== newContact.id ? contact : response.data))
          setNewName("")
          setNewNumber("")
        })
        .catch(error => {
          setFail(true)
          setError(error.response.data.error)
          axios
          .get(baseURL + "/api/persons")
          .then(response => {
            setContacts(response.data)
          })
        })
      }
    }
  }

  const shownContacts = contacts.filter(contact =>
    contact.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
  )

  // Handle delete request
  const handleDeleteClick = (id) => {
    setRecentAdded(newName)
    axios
    .delete(`${baseURL}/api/persons/${id}`)
    .then(() => {
      setContacts(contacts.filter(contact => 
        contact.id != id
      ))
    })
    .catch(error => {
      setFail(true)
      setError(error.response.data.error)
    })
  }


  // Getting the initial data from the server
  useEffect(() => {
    axios
    .get(baseURL + "/api/persons")
    .then(response => {
      setContacts(response.data)
    })
    .catch(error => {
      setError(error.response.data.error)
      setFail(true)
    })
  }, [])
  

  return (
    <div>
      <h2>Phonebook</h2>
      <AlertSuccess success={success} setSuccess={setSuccess} contact={recentAdded} />
      <AlertFail fail={fail} setFail={setFail} contact={recentAdded} message={error} />
      <Filter filter={filter} onChange={handleFilterChange} /> 
      <h2>add a new</h2>
      <PersonForm addNewContact={addNewContact} newName={newName} newNumber={newNumber}
      handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <Persons contacts={shownContacts} handleDeleteClick={handleDeleteClick}/>
    </div>
  )
}

export default App
