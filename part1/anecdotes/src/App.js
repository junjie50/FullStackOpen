import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const DisplayAnecdote = (props) => {
  return (
    <h4>
      {props.content}
      <br></br>
      has {props.vote} votes
    </h4>
  )
}

const AnecdoteMostVote = (props) => {
  return (
    <div>
      <h1>
        Anecdote with most votes
      </h1>
      <h4>
        {props.content}
        <br></br>
        has {props.vote} votes
      </h4>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const randomSelect = () => {
    let index
    do {
      index = Math.floor(Math.random() * anecdotes.length)
    } while(index === selected)
    setSelected(index)
  }

  const increaseVote = () => {
    let newVotes = { ...votes}
    newVotes[selected] += 1
    setVote(newVotes)
    if(newVotes[selected] > newVotes[popular]) {
      setPopular(selected)
    }
  }

  const [selected, setSelected] = useState(0)
  const [popular, setPopular] = useState(0)
  const [votes, setVote] = useState(anecdotes.map(() => 0))

  return (
    <div>
      <DisplayAnecdote content={anecdotes[selected]} vote={votes[selected]} />
      <Button onClick={increaseVote} text="vote" />
      <Button onClick={randomSelect} text="next anexdote"/>
      <AnecdoteMostVote content={anecdotes[popular]}  vote={votes[popular]}/>
    </div>
  )
}

export default App
