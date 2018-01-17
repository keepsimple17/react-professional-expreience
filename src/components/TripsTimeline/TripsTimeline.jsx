import React from 'react'
import PropTypes from 'prop-types'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'

import cn from '../../util/cn'
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
      <div className="container">
        <div className="row">
          <div className="col-12">
            <ul className="bullet-controls">
              {trips.trips.map((trip, i) => (
                <li className="bullet-item" key={trip.pictureUrl}>
                  <span
                    {...cn('bullet', {
                      '-active': i === 1
                    })}
                  >
                    {i + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
)

TripsTimeline.propTypes = {
  trips: PropTypes.shape({
    trips: MobxPropTypes.observableArrayOf(PropTypes.shape({
      pictureUrl: PropTypes.string
    }))
  }).isRequired
}

export default observer(TripsTimeline)
