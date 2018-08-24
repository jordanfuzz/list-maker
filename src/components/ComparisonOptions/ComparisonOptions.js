import React, { Component } from 'react'
import './ComparisonOptions.css'

class ComparisonOptions extends Component {
  constructor() {
    super()

    this.handleSwap = this.handleSwap.bind(this)
  }

  handleSwap(items, i, j) {
    let temp = items[i]
    items[i] = items[j]
    items[j] = temp

    this.props.handleNext(items[i + 1], items[j + 1], true)
  }

  render() {
    let { items, index } = this.props

    return (
      <div>
        {this.props.comparisonsFinished ? (
          <div>Dunzo</div>
        ) : (
          <div className="options-container">
            <span
              className="options"
              onClick={() => this.handleSwap(items, index, index + 1)}
            >
              {items[index]}
            </span>
            <span
              className="options"
              onClick={() =>
                this.props.handleNext(items[index + 1], items[index + 2], false)
              }
            >
              {items[index + 1]}
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default ComparisonOptions
