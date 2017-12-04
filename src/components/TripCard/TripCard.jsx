import React from 'react'
import PropTypes from 'prop-types'
import { format as formatDate } from 'date-fns/esm'
import { injectIntl, FormattedNumber } from 'react-intl'

import { gramsToPounds, meterToMiles } from '../../util/conversions'

import './TripCard.css'

const getFormatedDate = epochSeconds => formatDate(new Date(epochSeconds * 1000), 'DD MMM YY')

const TripCard = ({ profile, trip }) => (
  <div className="trip-card">
    <div className="row no-gutters align-items-center details-row">
      <div className="col-auto">
        <img className="profile-picture" src={profile.profilePictureUrl} alt={profile.fullName} />
      </div>
      <div className="col">
        <p className="trip-description">
          <strong>{profile.fullName || `@${profile.username}`}</strong>
        </p>
      </div>
      <div className="col-auto">
        <p className="trip-carbon-output text-right">
          <span className="trip-badge">
            <FormattedNumber value={gramsToPounds(trip.carbonOutput)} />
            {' '}
            lbs
          </span>
        </p>
        <p className="trip-date text-right">{getFormatedDate(trip.tripDate)}</p>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <div className="embed-responsive embed-responsive-1by1">
          <img className="trip-picture embed-responsive-item" src={trip.pictureUrl} alt="Trip" />
        </div>
      </div>
    </div>
    <div className="row no-gutters align-items-center details-row">
      <div className="col">
        <p className="trip-description">
          <strong>
            Travelled
            {' '}
            <FormattedNumber value={meterToMiles(trip.distance)} />
            {' '}
            mi to
            {' '}
            {trip.destinationName}
          </strong>
        </p>
      </div>
    </div>
  </div>
)

TripCard.propTypes = {
  profile: PropTypes.shape({
    fullName: PropTypes.string,
    profilePictureUrl: PropTypes.string,
    username: PropTypes.string
  }).isRequired,
  trip: PropTypes.shape({
    carbonOutput: PropTypes.number,
    destinationName: PropTypes.string,
    distance: PropTypes.number,
    pictureUrl: PropTypes.string,
    tripDate: PropTypes.number
  }).isRequired
}

export default injectIntl(TripCard)
