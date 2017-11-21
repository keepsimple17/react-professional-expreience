import React from 'react'
import PropTypes from 'prop-types'

import ProfileCard from '../ProfileCard/ProfileCard'

const FriendsList = ({ data }) => (
  <ul className="friend-list">
    {data.friends &&
      data.friends.map((profile, i) => (
        <li className="friend-item" key={profile.username}>
          <ProfileCard profile={profile} />
        </li>
      ))}
  </ul>
)

FriendsList.propTypes = {
  data: PropTypes.shape({
    friends: PropTypes.arrayOf(PropTypes.shape({
      username: PropTypes.string
    }))
  }).isRequired
}

export default FriendsList
