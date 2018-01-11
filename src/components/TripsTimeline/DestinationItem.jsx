import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import './DestinationItem.css'

const DestinationItem = ({ trip }) => (
  <div className="destination-item">
    <div className="row align-items-center">
      <div className="col-auto">
        <div className="ring-wrapper">
          <img
            alt="Trip"
            className="trip-picture"
            src={trip.pictureUrl}
          />
        </div>
      </div>
      <div className="col">
        <div className="destination-name">
          {trip.destinationName}
        </div>
      </div>
    </div>
  </div>
)

DestinationItem.propTypes = {
  trip: PropTypes.shape({
    pictureUrl: PropTypes.string
  }).isRequired
}

export default observer(DestinationItem)
