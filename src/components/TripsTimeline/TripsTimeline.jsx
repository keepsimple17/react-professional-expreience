import React from 'react'
import PropTypes from 'prop-types'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'
import { Link } from 'react-router-dom'

import cn from '../../util/cn'
import DestinationItem from './DestinationItem'
import DistanceItem from './DistanceItem'

import './TripsTimeline.css'

const TripsTimeline = ({ limit, trips, url }) => (
  <div className="trips-timeline">
    <ul className="trip-list">
      {trips.trips &&
        trips.trips.slice(0, limit).map((trip, i, l, last = l.length === i + 1) => (
          <li {...cn('trip-item', { '-first': i === 0 })} key={trip.pictureUrl}>
            <div className="row flex-nowrap align-items-center">
              <div className="col">
                <DestinationItem trip={trip} />
              </div>
              {!last && (
                <div className="d-none d-md-block col-auto">
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
          <div className="col text-center text-md-right">
            <div>
              <Link className="see-all-trips-link" title="See carbon production" to={url}>
                Show all trips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

TripsTimeline.defaultProps = {
  limit: 5
}

TripsTimeline.propTypes = {
  limit: PropTypes.number,
  trips: PropTypes.shape({
    trips: MobxPropTypes.observableArrayOf(PropTypes.shape({
      pictureUrl: PropTypes.string
    }))
  }).isRequired,
  url: PropTypes.string.isRequired
}

export default observer(TripsTimeline)
