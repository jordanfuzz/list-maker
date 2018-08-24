import React, { Component } from 'react'
import './App.css'
import ComparisonOptions from './components/ComparisonOptions/ComparisonOptions'

class App extends Component {
  constructor() {
    super()

    this.state = {
      textField: '',
      items: [],
      comparisonsStarted: false,
      comparisonsIndex: 0,
      alreadyComparedItems: [],
      swapped: true,
      comparisonsFinished: false,
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleStartOver = this.handleStartOver.bind(this)
    this.renderFinishedList = this.renderFinishedList.bind(this)
    this.shouldSkip = this.shouldSkip.bind(this)
    this.recordPairAndSkipIfNeeded = this.recordPairAndSkipIfNeeded.bind(this)
  }

  handleTextFieldChange(event) {
    this.setState({
      textField: event.target.value,
    })
  }

  handleStart(event) {
    event.preventDefault()
    this.setState({
      items: this.state.textField.split('\n').reverse(),
      comparisonsStarted: true,
      comparisonsFinished: false,
    })
  }

  handleStartOver() {
    if (!this.state.swapped) {
      this.setState({
        comparisonsFinished: true,
      })
    } else {
      console.log('Should be starting over')
      this.setState({
        comparisonsIndex: 0,
        swapped: false,
      })
    }
  }

  handleNext(firstItem, secondItem, swapped) {
    let { items, comparisonsIndex } = this.state
    let firstItem = items[comparisonsIndex]
    let secondItem = items[comparisonsIndex + 1]

    if (!secondItem) this.handleStartOver()

    if (swapped) {
      this.setState({
        swapped: true,
      })
    }

    if (comparisonsIndex >= items.length - 2) {
      this.handleStartOver()
    } else {
      this.setState(
        {
          comparisonsIndex: comparisonsIndex + 1,
        },
        () => {
          this.recordPairAndSkipIfNeeded(firstItem, secondItem)
        }
      )
    }
  }

  recordPairAndSkipIfNeeded(firstItem, secondItem) {
    let { alreadyComparedItems } = this.state
    if (this.shouldSkip()) {
      console.log('skipping next')
      this.handleNext(firstItem + 1, secondItem + 1, false)
    } else {
      alreadyComparedItems.push(`${firstItem}, ${secondItem}`)
      console.log('recorded pair', `${firstItem}, ${secondItem}`)
    }
  }

  shouldSkip() {
    let { items, alreadyComparedItems, comparisonsIndex } = this.state
    let firstItem = items[comparisonsIndex]
    let secondItem = items[comparisonsIndex + 1]

    if (!items[comparisonsIndex + 2]) return false

    let result = alreadyComparedItems.find(itemPair => {
      return itemPair === `${firstItem}, ${secondItem}`
    })
    console.log('already have:', alreadyComparedItems)
    console.log('looking for:', `${firstItem}, ${secondItem}`)
    console.log('returning:', !!result)
    return !!result
  }

  renderFinishedList() {
    return this.state.items.reverse().map((item, i) => {
      return <li key={i}>{item}</li>
    })
  }

  render() {
    return (
      <div className="App">
        <span>Paste your text here:</span>
        <textarea
          className="text-box"
          type="text"
          value={this.state.textField}
          onChange={this.handleTextFieldChange}
        />
        <button onClick={this.handleStart}>Start</button>
        {this.state.comparisonsStarted && !this.state.comparisonsFinished ? (
          <ComparisonOptions
            index={this.state.comparisonsIndex}
            items={this.state.items}
            handleNext={this.handleNext}
            comparisonsFinished={this.state.comparisonsFinished}
          />
        ) : (
          <ol>{this.renderFinishedList()}</ol>
        )}
      </div>
    )
  }
}

export default App
