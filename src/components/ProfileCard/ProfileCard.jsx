import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './ProfileCard.css'

const ProfileCard = ({ profile }) => {
  const heading = profile.fullName || `@${profile.username}`

  return (
    <div className="profile-card">
      <div className="row flex-nowrap">
        <div className="col-auto">
          <Link title="See carbon production" to={`/profile/${profile.username}`}>
            <img className="picture" src={profile.profilePictureUrl} alt={profile.username} />
          </Link>
        </div>
        <div className="col profile-links-col">
          <h3 className="text-ellipsis">
            <Link className="heading" title="See carbon production" to={`/profile/${profile.username}`}>
              {heading}
            </Link>
            {profile.fullName && (
              <a className="small" title="Go to Instagram profile" href={`https://www.instagram.com/${profile.username}`}>
                {`@${profile.username}`}
              </a>
            )}
          </h3>
          <p>
            <Link className="danger-button -fill" title="Download the app" to="/download">
              {`${profile.carbonOutput} CO₂/yr`}
            </Link>
            <Link className="danger-button" title="Download the app" to="/download">
              Not carbon neutral
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    carbonOutput: PropTypes.number,
    fullName: PropTypes.string,
    profilePictureUrl: PropTypes.string,
    username: PropTypes.string
  }).isRequired
}

export default ProfileCard
