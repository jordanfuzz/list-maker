import React, { useState } from 'react'
import './app.css'
import ComparisonOptions from './components/comparison-options/comparison-options'

function App() {
  const [textField, setTextField] = useState('')
  const [items, setItems] = useState([])
  const [comparisonsStarted, setComparisonsStarted] = useState(false)
  const [comparisonsIndex, setComparisonsIndex] = useState(0)
  const [alreadyComparedItems, setAlreadyComparedItems] = useState([])
  const [swapped, setSwapped] = useState(true)
  const [comparisonsFinished, setComparisonsFinished] = useState(false)

  const handleStart = event => {
    event.preventDefault()
    setItems(textField.split('\n').reverse())
    setComparisonsStarted(true)
    setComparisonsFinished(false)
  }

  const handleStartOver = () => {
    if (!swapped) {
      setComparisonsFinished(true)
    } else {
      setComparisonsIndex(0)
      setSwapped(false)
    }
  }

  const handleNext = (firstItem, secondItem, wasSwapped) => {
    if (!firstItem || !secondItem) return handleStartOver()
    if (recordPairAndSkipIfNeeded(firstItem, secondItem)) return
    if (wasSwapped) {
      setSwapped(true)
    }
    setComparisonsIndex(comparisonsIndex + 1)
  }

  const recordPairAndSkipIfNeeded = (firstItem, secondItem) => {
    if (shouldSkip(firstItem, secondItem)) {
      setComparisonsIndex(comparisonsIndex + 1)
      handleNext(items[comparisonsIndex], items[comparisonsIndex + 1], false)
      return true
    } else {
      setAlreadyComparedItems([
        ...alreadyComparedItems,
        `${firstItem}, ${secondItem}`,
      ])
      return false
    }
  }

  const shouldSkip = (firstItem, secondItem) => {
    let result = alreadyComparedItems.find(itemPair => {
      return itemPair === `${firstItem}, ${secondItem}`
    })
    return !!result
  }

  const renderFinishedList = () => {
    return items.map((item, i) => (
      <span className="finished-list-item" key={i}>
        {item}
      </span>
    ))
  }

  return (
    <div className="App">
      {!comparisonsStarted & !comparisonsFinished ? (
        <div>
          {' '}
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
          </button>{' '}
        </div>
      ) : comparisonsStarted && !comparisonsFinished ? (
        <ComparisonOptions
          index={comparisonsIndex}
          items={items}
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
