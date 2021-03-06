import React, { Component } from 'react'
import './comparison-options.css'

function ComparisonOptions(props) {
  const handleSwap = (items, i, j) => {
    let temp = items[i]
    items[i] = items[j]
    items[j] = temp

    props.handleNext(items[i + 1], items[j + 1], true)
  }

  let { items, index } = props

  return (
    <div>
      {props.comparisonsFinished ? (
        <div>Dunzo</div>
      ) : (
        <div className="options-container">
          <span
            className="options"
            onClick={() => handleSwap(items, index, index + 1)}
          >
            {items[index]}
          </span>
          <span
            className="options"
            onClick={() =>
              props.handleNext(items[index + 1], items[index + 2], false)
            }
          >
            {items[index + 1]}
          </span>
        </div>
      )}
    </div>
  )
}

export default ComparisonOptions
