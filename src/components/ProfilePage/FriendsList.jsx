import React from 'react'
import PropTypes from 'prop-types'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'

import cn from '../../util/cn'
import ProfileCard from '../ProfileCard/ProfileCard'

import './FriendsList.css'

const FriendsList = ({ friends }) => (
  <ul
    {...cn('friends-list', {
      '-loading': !!friends.loading,
      '-empty': !friends.friends || !friends.friends.length
    })}
  >
    {friends.friends &&
      friends.friends.map((profile, i) => (
        <li className="friend-item" key={profile.username}>
          <ProfileCard profile={profile} />
        </li>
      ))}
    {!!friends.loading && <li className="loading-message">Loading friends...</li>}
  </ul>
)

FriendsList.propTypes = {
  friends: PropTypes.shape({
    loading: PropTypes.bool,
    friends: MobxPropTypes.observableArrayOf(PropTypes.shape({}))
  }).isRequired
}

export default observer(FriendsList)
