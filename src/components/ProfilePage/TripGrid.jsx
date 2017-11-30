import React from 'react'
import PropTypes from 'prop-types'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'

import cn from '../../util/cn'
import TripGridItem from './TripGridItem'

import './TripGrid.css'

const getDelay = (current, last, index) => {
  const newCount = current - last
  const step = 1600 / Math.max(newCount, 1)

  return Math.round(step * Math.max(index - last, 0))
}

const TripGrid = ({ profile }) => (
  <ul {...cn('trip-grid', { '-loading': profile.trips.loading })}>
    {profile.trips.trips &&
      profile.trips.trips.map((trip, i) => (
        <TripGridItem
          delay={getDelay(profile.trips.trips.length, profile.trips.lastCount, i)}
          key={trip.pictureUrl}
          trip={trip}
        />
      ))}

    {!(profile.trips.trips && profile.trips.trips.length) && (
      <li className="loading-message">
        <p>{profile.trips.loading ? 'Searching for travel posts...' : 'No travel posts found'}</p>
      </li>
    )}
    <li className="overlay" />
  </ul>
)

TripGrid.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    trips: PropTypes.shape({
      loading: PropTypes.bool,
      trips: MobxPropTypes.observableArrayOf(PropTypes.shape({}))
    })
  }).isRequired
}

export default observer(TripGrid)
