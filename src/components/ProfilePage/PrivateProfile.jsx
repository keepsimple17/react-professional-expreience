import React from 'react'
import PropTypes from 'prop-types'

import getName from '../../util/getName'
import DownloadPromotion from '../DownloadPromotion/DownloadPromotion'

import './PrivateProfile.css'

const PrivateProfile = ({ profile }) => (
  <div className="private-profile">
    <div className="private-profile-hero">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="private-profile-card">
              <p>
                <img
                  className="profile-picture"
                  src={profile.profilePictureUrl}
                  alt={profile.username}
                />
              </p>
              <p className="private-profile-info">
                <strong className="user-name">
                  {getName(profile)}
                </strong>
                {' '}
                 has a private Instagram account
              </p>
              <p className="private-profile-question">
                Is this you?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DownloadPromotion />
  </div>
)

PrivateProfile.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string
  }).isRequired
}

export default PrivateProfile
