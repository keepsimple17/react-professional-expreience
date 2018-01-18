import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { injectIntl, FormattedDate } from 'react-intl'

import pipe from '../../util/pipe'

import './DestinationItem.css'

const DestinationItem = ({ trip }) => (
  <div className="destination-item">
    <div className="trip-date">
      <FormattedDate
        day="2-digit"
        month="short"
        value={new Date(trip.tripDate * 1000)}
        year="2-digit"
      />
    </div>
    <div className="ring-wrapper">
      <img alt="Trip" className="trip-picture" src={trip.pictureUrl} />
    </div>
    <div className="destination-name">{trip.destinationName}</div>
  </div>
)

DestinationItem.propTypes = {
  trip: PropTypes.shape({
    pictureUrl: PropTypes.string
  }).isRequired
}

export default pipe([
  observer,
  injectIntl
])(DestinationItem)
