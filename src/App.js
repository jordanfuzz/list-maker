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
    return this.state.items.map((item, i) => (
      <span className="finished-list-item" key={i}>
        {item}
      </span>
    ))
  }

  render() {
    const { comparisonsFinished, comparisonsStarted } = this.state
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
              value={this.state.textField}
              onChange={this.handleTextFieldChange}
            />
            <button className="start-button" onClick={this.handleStart}>
              Start
            </button>{' '}
          </div>
        ) : comparisonsStarted && !comparisonsFinished ? (
          <ComparisonOptions
            index={this.state.comparisonsIndex}
            items={this.state.items}
            handleNext={this.handleNext}
            comparisonsFinished={this.state.comparisonsFinished}
          />
        ) : (
          <div className="finished-list-container">
            {this.renderFinishedList()}
          </div>
        )}
      </div>
    )
  }
}

export default App
