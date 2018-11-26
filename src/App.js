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
      // shouldStartOver: false,
    }

    this.handleTextFieldChange = this.handleTextFieldChange.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleStartOver = this.handleStartOver.bind(this)
    this.renderFinishedList = this.renderFinishedList.bind(this)
    this.shouldSkip = this.shouldSkip.bind(this)
    this.recordPairAndSkipIfNeeded = this.recordPairAndSkipIfNeeded.bind(this)
    this.logListState = this.logListState.bind(this)
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
    console.log(
      '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ starting over (next)',
      this.state.swapped
    )
    if (!this.state.swapped) {
      this.setState({
        comparisonsFinished: true,
      })
    } else {
      // console.log('Should be starting over')
      this.setState(
        {
          comparisonsIndex: 0,
          swapped: false,
        },
        () => console.log('comparisonsIndex', this.state.comparisonsIndex)
      )
    }
  }

  logListState() {
    let { items, comparisonsIndex } = this.state
    console.log(
      items
        .map((item, i) => {
          if (i === comparisonsIndex || i === comparisonsIndex + 1)
            return `{${item}}`
          return item
        })
        .join(', ')
    )
  }

  //maybe remove firstItem/secondItem? Strictly use comparison index?
  handleNext(firstItem, secondItem, swapped) {
    console.log('inside handleNext', firstItem, secondItem)
    if (!firstItem || !secondItem) return this.handleStartOver()

    if (this.recordPairAndSkipIfNeeded(firstItem, secondItem)) return
    if (swapped) {
      this.setState({
        swapped: true,
      })
    }
    this.setState(
      {
        comparisonsIndex: this.state.comparisonsIndex + 1,
        // check for future start overs?
        // shouldStartOver:
        //   !items[comparisonsIndex + 2] || !items[comparisonsIndex + 3],
      },
      this.logListState
    )
  }

  recordPairAndSkipIfNeeded(firstItem, secondItem) {
    let { items, comparisonsIndex } = this.state
    console.log('Record Pair or Skip')
    // console.log('first item: ', firstItem)
    // console.log('second item: ', secondItem)
    let { alreadyComparedItems } = this.state
    if (this.shouldSkip(firstItem, secondItem)) {
      console.log('skipping next')
      //hmm...
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
      // console.log('recording')
      // console.log('recorded pair', firstItem, secondItem)
      // console.log('recorded items: ', alreadyComparedItems)
    }
  }

  shouldSkip(firstItem, secondItem) {
    console.log('inside skip function')

    // if (this.state.shouldStartOver) return this.handleStartOver()

    let result = this.state.alreadyComparedItems.find(itemPair => {
      return itemPair === `${firstItem}, ${secondItem}`
    })
    console.log('should I skip?', !!result)
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
