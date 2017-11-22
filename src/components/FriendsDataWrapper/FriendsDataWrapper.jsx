import React, { Component } from 'react'
import PropTypes from 'prop-types'

import api from '../../api'
import wait from '../../util/wait'

class FriendsDataWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      attempts: 0,
      friends: null,
      lastCount: 0,
      loading: 0
    }
  }

  componentWillMount () {
    this.updateFriendsData(this.props.profile.username)
  }

  componentWillReceiveProps (nextProps) {
    if (
      this.props.profile.username !== nextProps.profile.username
    ) {
      this.setState(() => ({ attempts: 0, lastCount: 0, friends: null }))
      this.updateFriendsData(nextProps.profile.username)
    }
  }

  componentWillUnmount () {
    this.unmounted = true
  }

  setState (...args) {
    if (!this.unmounted) super.setState(...args)
  }

  decrementLoading (n = 1) {
    this.setState(prevState => ({
      loading: Math.max(prevState.loading - n, 0)
    }))
  }

  incrementLoading (n = 1) {
    this.setState(prevState => ({
      loading: prevState.loading + n
    }))
  }

  updateFriendsData (username) {
    this.incrementLoading()

    this.setState(prevState => ({ attempts: prevState.attempts + 1 }))

    return api.fetchProfileFriends(username).then((data) => {
      this.setState(prevState => ({
        friends: data.friends,
        lastCount: prevState.friends ? prevState.friends.length : 0
      }))

      return data.friendsFetched || this.unmounted
        ? data
        : wait(3000).then(() => this.updateFriendsData(username))
    }).then((data) => {
      this.decrementLoading()
      return data
    }).catch((error) => {
      this.setState(() => ({ error }))
      this.decrementLoading()
    })
  }

  render () {
    const {
      component: Comp,
      profile,
      ...rest
    } = this.props

    const {
      attempts,
      friends,
      lastCount,
      loading
    } = this.state

    return (
      <Comp
        {...rest}
        data={{
          attempts,
          friends,
          lastCount,
          loading,
          profile
        }}
      />
    )
  }
}

FriendsDataWrapper.propTypes = {
  component: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    username: PropTypes.string
  }).isRequired
}

export default FriendsDataWrapper
