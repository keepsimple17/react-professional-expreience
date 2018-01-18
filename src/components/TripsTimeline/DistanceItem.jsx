import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { injectIntl, FormattedNumber } from 'react-intl'
import { gramsToPounds, meterToMiles } from '../../util/conversions'

import travelIcon from '../../img/icons/travel.svg'
import travelDashes from '../../img/icons/travel-dashes.svg'

import './DistanceItem.css'

const DistanceItem = ({ trip }) => (
  <div className="distance-item">
    <div className="carbon-output">
      <FormattedNumber value={gramsToPounds(trip.carbonOutput)} /> CO₂
    </div>
    <div className="distance-iconography">
      <div className="row no-gutters align-items-center">
        <div className="col-auto">
          <img className="travel-dashes-icon" src={travelDashes} alt="Path dashes" />
        </div>
        <div className="col-auto">
          <img className="travel-icon" src={travelIcon} alt="Travel Icon" />
        </div>
        <div className="col-auto">
          <img className="travel-dashes-icon" src={travelDashes} alt="Path dashes" />
        </div>
      </div>
    </div>
    <div className="distance">
      <FormattedNumber value={meterToMiles(trip.distance)} /> miles
    </div>
  </div>
)

DistanceItem.propTypes = {
  trip: PropTypes.shape({
    pictureUrl: PropTypes.string
  }).isRequired
}

export default injectIntl(observer(DistanceItem))
