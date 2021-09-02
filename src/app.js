import React, { useState } from 'react'
import './app.css'
import ComparisonOptions from './components/comparison-options/comparison-options'

function App() {
  const [textField, setTextField] = useState('')
  const [items, setItems] = useState([])
  const [comparisonsIndex, setComparisonsIndex] = useState(0)
  const [comparisonsStarted, setComparisonsStarted] = useState(false)
  const [comparisonsFinished, setComparisonsFinished] = useState(false)
  const [wasSwappedThisRound, setWasSwappedThisRound] = useState(false)
  const [alreadyComparedItems, setAlreadyComparedItems] = useState([])

  const handleStart = event => {
    event.preventDefault()
    //TODO - Validate this list, make sure it's not empty, has no breaking characters, and has no duplicates
    setItems(textField.split('\n').reverse())
    setComparisonsStarted(true)
    setComparisonsFinished(false)
  }

  const handleStartOver = () => {
    console.log('STARTING OVER!')
    if (!wasSwappedThisRound) setComparisonsFinished(true)
    else {
      setComparisonsIndex(0)
      setWasSwappedThisRound(false)
    }
  }

  const handleNext = (firstItem, secondItem, wasSwapped) => {
    recordPair(firstItem, secondItem)
    if (wasSwapped) setWasSwappedThisRound(true)
    if (!items[comparisonsIndex + 2]) return handleStartOver()

    const nextIndex = findNextUncomparedIndex(comparisonsIndex + 1)

    setComparisonsIndex(nextIndex)
  }

  const recordPair = (firstItem, secondItem) => {
    setAlreadyComparedItems([
      ...alreadyComparedItems,
      `${firstItem}, ${secondItem}`,
    ])
  }

  const findNextUncomparedIndex = startIndex => {
    let nextIndex = startIndex

    items.every((item, i, arr) => {
      if (i < startIndex) return true
      console.log('at index', i)
      const pairString = `${item}, ${arr[i + 1]}`
      console.log('pear string', pairString)
      if (!alreadyComparedItems.find(itemPair => itemPair === pairString)) {
        console.log('Next index should be: ', i)
        nextIndex = i
        return false
      } else return true
    })

    return nextIndex
  }

  const renderFinishedList = () => {
    return items.map((item, i) => (
      <span className="finished-list-item" key={i}>
        {item}
      </span>
    ))
  }

  console.log('Rendering...', {
    items,
    comparisonsIndex,
    wasSwappedThisRound,
    alreadyComparedItems,
  })

  return (
    <div className="App">
      {!comparisonsStarted & !comparisonsFinished ? (
        <div>
          <span className="text-box-label">
            Paste or type your unsorted list here:
          </span>
          <textarea
            className="text-box"
            type="text"
            value={textField}
            onChange={e => setTextField(e.target.value)}
          />
          <button className="start-button" onClick={handleStart}>
            Start
          </button>
        </div>
      ) : comparisonsStarted && !comparisonsFinished ? (
        <ComparisonOptions
          items={items}
          index={comparisonsIndex}
          handleNext={handleNext}
          comparisonsFinished={comparisonsFinished}
        />
      ) : (
        <div className="finished-list-container">{renderFinishedList()}</div>
      )}
    </div>
  )
}

export default App
