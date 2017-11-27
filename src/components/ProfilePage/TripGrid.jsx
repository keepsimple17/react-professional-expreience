import React from 'react'
import PropTypes from 'prop-types'

import cn from '../../util/cn'
import TripGridItem from './TripGridItem'

import './TripGrid.css'

const getDelay = (current, last, index) => {
  const newCount = current - last
  const step = 1600 / Math.max(newCount, 1)

  return Math.round(step * Math.max(index - last, 0))
}

const TripGrid = ({ data }) => (
  <ul {...cn('trip-grid', { '-loading': data.loading })}>
    {data.trips &&
      data.trips.map((trip, i) => (
        <TripGridItem
          delay={getDelay(data.trips.length, data.lastCount, i)}
          key={trip.pictureUrl}
          trip={trip}
        />
      ))}

    {!(data.trips && data.trips.length) && (
      <li className="loading-message">
        <p>{data.loading ? 'Searching for travel posts...' : 'No travel posts found'}</p>
      </li>
    )}
    <li className="overlay" />
  </ul>
)

TripGrid.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      username: PropTypes.string
    }),
    loading: PropTypes.number,
    trips: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired
}

export default TripGrid
