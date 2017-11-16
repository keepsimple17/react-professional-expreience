import React, { Component } from 'react'
import PropTypes from 'prop-types'

import api from '../../api'
import cn from '../../util/cn'
import TripGridItem from './TripGridItem'

import './TripGrid.css'

const getDelay = (current, last, index) => {
  const newCount = current - last
  const step = 1600 / Math.max(newCount, 1)

  return Math.round(step * Math.max(index - last, 0))
}

class TripGrid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lastCount: 0,
      loading: 0,
      trips: null
    }
  }

  componentWillMount () {
    this.setState(() => ({ attempts: 0 }))
    this.updateTripsData(this.props.username, this.props.zipcode)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.username !== nextProps.username || this.props.zipcode !== nextProps.zipcode) {
      this.updateTripsData(nextProps.username, nextProps.zipcode)
      this.setState(() => ({ lastCount: 0, trips: null }))
    }
  }

  decrementLoading (n = 1) {
    this.setState(prevState => ({
      loading: Math.max(prevState.loading - n, 0)
    }))
  }

  incrementLoading (n = 1) {
    this.setState(prevState => ({
      loading: prevState.loading + n
    }))
  }

  updateTripsData (username, zipcode) {
    this.incrementLoading()

    return api.fetchProfileTrips(username, zipcode).then((data) => {
      this.setState(prevState => ({
        lastCount: prevState.trips ? prevState.trips.length : 0,
        trips: data
      }))

      this.decrementLoading()
    }).catch((error) => {
      this.setState(() => ({ error }))
      this.decrementLoading()
    })
  }

  render () {
    return (
      <ul {...cn('trip-grid', { '-loading': this.state.loading })}>
        {this.state.trips &&
          this.state.trips.map((trip, i) => (
            <TripGridItem
              delay={getDelay(this.state.trips.length, this.state.lastCount, i)}
              key={trip.pictureUrl}
              trip={trip}
            />
          ))}

        {!(this.state.trips && this.state.trips.length) && (
          <li className="loading-message">
            <p>
              {this.state.loading ? 'Searching for travel posts...' : 'No travel posts found'}
            </p>
          </li>
        )}
        <li className="overlay" />
      </ul>
    )
  }
}

TripGrid.propTypes = {
  username: PropTypes.string.isRequired,
  zipcode: PropTypes.string.isRequired
}

export default TripGrid
