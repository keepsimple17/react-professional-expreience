import React from 'react'
import PropTypes from 'prop-types'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'

import cn from '../../util/cn'
import TripCard from '../TripCard/TripCard'

import './TripCardList.css'

const TripCardList = ({ profile }) => (
  <div
    {...cn('trip-card-list', {
      '-loading': profile.trips.loading && !profile.trips.trips.length,
      '-empty': !profile.trips.loading && !profile.trips.trips.length
    })}
  >
    <div className="row">
      {profile.trips.trips &&
        profile.trips.trips.map(trip => (
          <div className="col-12 col-md-6 col-xl-4 trip-col" key={trip.pictureUrl}>
            <TripCard profile={profile} trip={trip} />
          </div>
        ))}
      {!!profile.trips.loading && (
        <div className="col-12 box-message">
          <p className="box-title">Calculating</p>
          <p className="box-tagline">Calculating carbon footprint…</p>
        </div>
      )}
      {!profile.trips.loading &&
        !profile.trips.trips.length && (
          <div className="col-12 box-message">
            <p className="box-title">No trips</p>
            <p className="box-tagline">@{profile.username} does not have any travel posts</p>
          </div>
        )}
    </div>
  </div>
)

TripCardList.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    trips: PropTypes.shape({
      loading: PropTypes.bool,
      trips: MobxPropTypes.observableArrayOf(PropTypes.shape({}))
    })
  }).isRequired
}

export default observer(TripCardList)
