import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cn from '../../util/cn'
import SmallTripBox from '../SmallTripBox/SmallTripBox'

const getColor = (carbon) => {
  // Blue if no carbon output
  if (!carbon) return '#1ba1fb'

  const alpha = Math.max(Math.min(carbon / 800000, 1), 0.1)

  return `hsla(0, 64%, 52%, ${alpha})`
}

class TripGridItem extends Component {
  constructor () {
    super()
    this.state = { ready: false }
  }

  componentDidMount () {
    setTimeout(() => this.setState(() => ({ ready: true })), this.props.delay)
  }

  render () {
    return (
      <li
        {...cn('trip-grid-item', { '-dimmed': !this.state.ready })}
        style={{
          backgroundColor: getColor(this.props.trip.carbonOutput)
        }}
      >
        <SmallTripBox trip={this.props.trip} />
      </li>
    )
  }
}

TripGridItem.propTypes = {
  delay: PropTypes.number.isRequired,
  trip: PropTypes.shape({
    carbonOutput: PropTypes.number
  }).isRequired
}

export default TripGridItem
