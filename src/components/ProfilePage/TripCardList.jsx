import React from 'react'
import PropTypes from 'prop-types'

import cn from '../../util/cn'
import TripCard from '../TripCard/TripCard'

import './TripCardList.css'

const TripCardList = ({ data }) => (
  <div
    {...cn('trip-card-list', {
      '-loading': !!data.loading,
      '-empty': !data.trips || !data.trips.length
    })}
  >
    <div className="row">
      {data.trips &&
        data.trips.map(trip => (
          <div className="col-12 col-md-6 col-xl-4 trip-col" key={trip.pictureUrl}>
            <TripCard profile={data.profile} trip={trip} />
          </div>
        ))}
      {!!data.loading && (
        <div className="col-12 loading-message">
          <p>
            Loading travel posts...
          </p>
        </div>
      )}
    </div>
  </div>
)

TripCardList.propTypes = {
  data: PropTypes.shape({
    profile: PropTypes.shape({
      username: PropTypes.string
    }),
    loading: PropTypes.number,
    trips: PropTypes.arrayOf(PropTypes.shape({}))
  }).isRequired
}

export default TripCardList
