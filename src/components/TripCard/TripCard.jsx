import React from 'react'
import PropTypes from 'prop-types'

import './TripCard.css'

const TripCard = ({ profile, trip }) => (
  <div className="trip-card">
    <div className="row details-row">
      <div className="col-auto">
        <img className="profile-picture" src={profile.profilePictureUrl} alt={profile.fullName} />
      </div>
      <div className="col">
        <p className="trip-description">
          {
            `${profile.fullName || profile.username} took a ${trip.distance} mile trip to
            ${trip.destination} and did not pay to offset his carbon.`
          }
        </p>
      </div>
      <div className="col-auto">
        <p className="trip-carbon-output text-right">
          <span className="trip-badge">
            {`${trip.carbonOutput} lbs`}
          </span>
        </p>
        <p className="trip-date text-right">
          {trip.date}
        </p>
      </div>
    </div>
    <div className="row">
      <div className="col">
        <div className="embed-responsive-1by1">
          <img className="trip-picture" src={trip.pictureUrl} alt="Trip" />
        </div>
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
    date: PropTypes.string,
    destination: PropTypes.string,
    distance: PropTypes.number,
    pictureUrl: PropTypes.string
  }).isRequired
}

export default TripCard
