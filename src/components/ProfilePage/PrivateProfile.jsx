import React from 'react'
import PropTypes from 'prop-types'

import getName from '../../util/getName'
import appleStoreBadge from '../../img/app-store-badge.svg'

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
    <div className="download-promotion">
      <div className="container">
        <div className="row">
          <div className="col col-md-6 offset-md-6">
            <h3 className="download-heading">How do you offset your carbon?</h3>
            <p className="download-paragraph">
              When you download our app, it will ask you for your home address, average monthly
              energy bill, and begin monitoring your transportation by car, subway, or flight
              through your smartphone.
            </p>
            <p className="download-paragraph">
              As you generate carbon, we will automatically bill your credit card up to an amount
              you specify each month.
            </p>
            <p>
              <a className="link" href="https://store.apple.com">
                <img
                  src={appleStoreBadge}
                  className="download-badge"
                  alt="Download on apple store"
                />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

PrivateProfile.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string
  }).isRequired
}

export default PrivateProfile
