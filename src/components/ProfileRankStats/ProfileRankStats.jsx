import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { injectIntl, FormattedNumber } from 'react-intl'
import { observer } from 'mobx-react'

import { gramsToPounds } from '../../util/conversions'

import carbonCloud from '../../img/icons/carbon-cloud.svg'
import instagramLogo from '../../img/icons/instagram.svg'

import './ProfileRankStats.css'

const ProfileRankStats = ({ profile }) => {
  const heading = profile.fullName || `@${profile.username}`

  return (
    <div className="profile-rank-stats">
      <div className="row align-items-center">
        <div className="col d-none d-md-flex col-md-auto">
          <p className="profile-picture">
            <Link title="See carbon production" to={`/profile/${profile.username}`}>
              <img alt={profile.username} className="picture" src={profile.profilePictureUrl} />
            </Link>
          </p>
        </div>
        <div className="col">
          <div className="row align-items-center">
            <div className="col-12 col-md">
              <h2 className="heading">
                <Link
                  className="full-name-link"
                  title="See carbon production"
                  to={`/profile/${profile.username}`}
                >
                  {heading}
                </Link>
              </h2>
            </div>
            <div className="col-12 d-md-none">
              <p className="profile-picture">
                <Link title="See carbon production" to={`/profile/${profile.username}`}>
                  <img alt={profile.username} className="picture" src={profile.profilePictureUrl} />
                </Link>
              </p>
            </div>
            <div className="col-12 col-md-auto">
              <p className="carbon-status">
                <Link className="danger-button" title="Download the app" to="/download">
                  Not carbon neutral
                </Link>
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-6 col-md-auto">
              <p className="instagram-username">
                <a
                  className="instagram-link"
                  href={`https://www.instagram.com/${profile.username}`}
                  title="Go to Instagram profile"
                >
                  <img alt="Instagram Logo" className="inline-icon" src={instagramLogo} />
                  {profile.username}
                </a>
              </p>
            </div>
            <div className="col-6 col-md-auto">
              <p className="carbon-output">
                <img alt="Carbon Output Icon" className="inline-icon" src={carbonCloud} />
                <FormattedNumber value={gramsToPounds(profile.carbonOutput)} /> lb CO₂ /yr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

ProfileRankStats.propTypes = {
  profile: PropTypes.shape({
    carbonOutput: PropTypes.number,
    fullName: PropTypes.string,
    profilePictureUrl: PropTypes.string,
    username: PropTypes.string
  }).isRequired
}

export default injectIntl(observer(ProfileRankStats))
