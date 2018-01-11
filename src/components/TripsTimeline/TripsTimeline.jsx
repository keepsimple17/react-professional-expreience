import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import DestinationItem from './DestinationItem'
import DistanceItem from './DistanceItem'

import './TripsTimeline.css'

const TripsTimeline = ({ trips }) => (
  <div className="trips-timeline">
    <div className="row">
      <ul className="trip-list">
        {trips.trips &&
          trips.trips.map((trip, i, l, last = l.length === i + 1) => (
            <li className="trip-item" key={trip.pictureUrl}>
              <div className="row">
                <div className="col">
                  <DestinationItem trip={trip} />
                </div>
                {!last && (
                  <div className="col-auto">
                    <DistanceItem trip={trip} />
                  </div>
                )}
              </div>
            </li>
          ))}
      </ul>
    </div>
    <div className="row">
      <div className="controls">
        controls
      </div>
    </div>
  </div>
)

TripsTimeline.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.shape({
    pictureUrl: PropTypes.string
  })).isRequired
}

export default observer(TripsTimeline)
