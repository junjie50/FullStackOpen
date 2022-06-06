import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const Header = (props) => {
  return (
  <h1>
    {props.header}
  </h1> 
  )
}

const Statistics = ({good, neutral, bad}) => {
  return (
    <div>
      <Header header="statistics" />
      <table border="1px solid">
        <StaticsticsHead />
        <StaticsticsBody good={good} bad={bad} neutral={neutral} />
      </table>
    </div>
  )
}

const StaticsticsHead = () => {
  return (
    <thead>
      <tr>
        <td>Category</td>
        <td>Stat</td>
      </tr>
    </thead>
  )
}

const StaticsticsBody = ({good, neutral, bad}) => {
  return (
    <tbody>
      <StatisticsLine category="good" count={good} />
      <StatisticsLine category="neutral" count={neutral} />
      <StatisticsLine category="bad" count={bad} />
      <StatisticsLine category="all" count={good + neutral + bad} />
      <StatisticsLine category="average" count={(good - bad)/(good + neutral + bad)} />
      <StatisticsLine category="positive" count={(good)/(good + neutral + bad)} unit="%" />
    </tbody>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.category}</td>
      <td>{props.count} {props.unit}</td>
    </tr>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header header="give feedback" />
      <Button onClick={() => setGood(good + 1)} text="good" />
      <Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button onClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App
