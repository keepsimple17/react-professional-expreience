import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import ProfileRankStats from '../ProfileRankStats/ProfileRankStats'
import TripsTimeline from '../TripsTimeline/TripsTimeline'

import './ProfileRow.css'

const ProfileRow = ({ profile, rank }) => (
  <div className="row profile-row">
    <div className="col-12">
      <ProfileRankStats profile={profile} rank={rank} />
    </div>
    <div className="col-12">
      <TripsTimeline trips={profile.trips} />
    </div>
  </div>
)

ProfileRow.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    trips: PropTypes.array
  }).isRequired,
  rank: PropTypes.number.isRequired
}

export default observer(ProfileRow)
