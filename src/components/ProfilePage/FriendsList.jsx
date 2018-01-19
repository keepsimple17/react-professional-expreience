import React from 'react'
import PropTypes from 'prop-types'
import { observer, PropTypes as MobxPropTypes } from 'mobx-react'

import cn from '../../util/cn'
import ProfileCard from '../ProfileCard/ProfileCard'

import './FriendsList.css'

const FriendsList = ({ friends }) => (
  <ul
    {...cn('friends-list', {
      '-loading': friends.loading && !friends.friends.length,
      '-empty': !friends.loading && !friends.friends.length
    })}
  >
    {friends.friends &&
      friends.friends.map((profile, i) => (
        <li className="friend-item" key={profile.username}>
          <ProfileCard profile={profile} />
        </li>
      ))}

    {friends.loading && (
      <div className="col-12 box-message">
        <p className="box-title">Calculating</p>
        <p className="box-tagline">Finding friends…</p>
      </div>
    )}
    {!friends.loading &&
      !friends.friends.length && (
        <div className="col-12 box-message">
          <p className="box-title">No friends</p>
          <p className="box-tagline">We could not find any friends</p>
        </div>
      )}
  </ul>
)

FriendsList.propTypes = {
  friends: PropTypes.shape({
    loading: PropTypes.bool,
    friends: MobxPropTypes.observableArrayOf(PropTypes.shape({}))
  }).isRequired
}

export default observer(FriendsList)
