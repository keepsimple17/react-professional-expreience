import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import DestinationItem from './DestinationItem'
import DistanceItem from './DistanceItem'

import './TripsTimeline.css'

const TripsTimeline = ({ trips }) => (
  <div className="trips-timeline">
    <ul className="trip-list">
      {trips.trips &&
        trips.trips.map((trip, i, l, last = l.length === i + 1) => (
          <li className="trip-item" key={trip.pictureUrl}>
            <div className="row flex-nowrap align-items-center">
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
    <div className="controls">
      controls
    </div>
  </div>
)

TripsTimeline.propTypes = {
  trips: PropTypes.arrayOf(PropTypes.shape({
    pictureUrl: PropTypes.string
  })).isRequired
}

export default observer(TripsTimeline)
