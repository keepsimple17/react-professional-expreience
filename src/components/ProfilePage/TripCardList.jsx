import React from 'react'
import PropTypes from 'prop-types'

import TripCard from '../TripCard/TripCard'

const TripCardList = ({ data }) => (
  <div className="row">
    {data.trips &&
      data.trips.map(trip => (
        <div className="col-12 col-md-6 col-xl-4 trip-col" key={trip.pictureUrl}>
          <TripCard profile={data.profile} trip={trip} />
        </div>
      ))}
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
