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
      this.setState({
        comparisonsIndex: 0,
        swapped: false,
      })
    }
  }

  handleNext(firstItem, secondItem, swapped) {
    if (!firstItem || !secondItem) return this.handleStartOver()
    if (this.recordPairAndSkipIfNeeded(firstItem, secondItem)) return
    if (swapped) {
      this.setState({
        swapped: true,
      })
    }
    this.setState({
      comparisonsIndex: this.state.comparisonsIndex + 1,
    })
  }

  recordPairAndSkipIfNeeded(firstItem, secondItem) {
    let { items, comparisonsIndex } = this.state
    let { alreadyComparedItems } = this.state
    if (this.shouldSkip(firstItem, secondItem)) {
      this.setState(
        {
          comparisonsIndex: comparisonsIndex + 1,
        },
        () =>
          this.handleNext(
            items[comparisonsIndex],
            items[comparisonsIndex + 1],
            false
          )
      )
      return true
    } else {
      alreadyComparedItems.push(`${firstItem}, ${secondItem}`)
      return false
    }
  }

  shouldSkip(firstItem, secondItem) {
    let result = this.state.alreadyComparedItems.find(itemPair => {
      return itemPair === `${firstItem}, ${secondItem}`
    })
    return !!result
  }

  renderFinishedList() {
    return this.state.items.map((item, i) => <li key={i}>{item}</li>)
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
