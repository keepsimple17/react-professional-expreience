import React from 'react'
import PropTypes from 'prop-types'

import cn from '../../util/cn'
import ProfileCard from '../ProfileCard/ProfileCard'

import './FriendsList.css'

const FriendsList = ({ data }) => (
  <ul
    {...cn(
      'friends-list',
      {
        '-loading': data.loading,
        '-empty': !data.friends || !data.friends.lenght
      }
    )}
  >
    {data.friends &&
      data.friends.map((profile, i) => (
        <li className="friend-item" key={profile.username}>
          <ProfileCard profile={profile} />
        </li>
      ))}
    <li className="loading-message">
      Loading friends...
    </li>
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
