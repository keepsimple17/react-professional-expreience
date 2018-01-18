import React from 'react'
import PropTypes from 'prop-types'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'

import cn from '../../util/cn'
import ProfileRankStats from '../ProfileRankStats/ProfileRankStats'
import TripsTimeline from '../TripsTimeline/TripsTimeline'

import './ProfileRow.css'

const ProfileRow = ({ profile, rank }) => (
  <div {...cn('profile-row', { '-odd': rank % 2, '-even': !(rank % 2) })}>
    <div className="container">
      <div className="row">
        <div className="col-12 col-md-1">
          <p className="profile-rank">
            <span className="rank">{rank}</span>
          </p>
        </div>
        <div className="col-12 col-md-11">
          <div className="row">
            <div className="col-12">
              <ProfileRankStats profile={profile} rank={rank} />
            </div>
            <div className="col-12">
              <div className="divider" />
            </div>
            <div className="col-12">
              <TripsTimeline trips={profile.trips} url={`/profile/${profile.username}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

ProfileRow.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    trips: PropTypes.shape({
      trips: MobxPropTypes.observableArray
    })
  }).isRequired,
  rank: PropTypes.number.isRequired
}

export default observer(ProfileRow)
