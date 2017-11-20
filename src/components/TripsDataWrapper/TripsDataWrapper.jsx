import React, { Component } from 'react'
import PropTypes from 'prop-types'

import api from '../../api'
import wait from '../../util/wait'

class TripsDataWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      attempts: 0,
      lastCount: 0,
      loading: 0,
      trips: null
    }
  }

  componentWillMount () {
    this.updateTripsData(this.props.profile.username, this.props.zipcode)
  }

  componentWillReceiveProps (nextProps) {
    if (
      this.props.profile.username !== nextProps.profile.username ||
      this.props.zipcode !== nextProps.zipcode
    ) {
      this.setState(() => ({ attempts: 0, lastCount: 0, trips: null }))
      this.updateTripsData(nextProps.profile.username, nextProps.zipcode)
    }
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

  updateTripsData (username, zipcode) {
    this.incrementLoading()

    this.setState(prevState => ({ attempts: prevState.attempts + 1 }))

    return api.fetchProfileTrips(username, zipcode).then((data) => {
      this.setState(prevState => ({
        lastCount: prevState.trips ? prevState.trips.length : 0,
        trips: data
      }))

      return data.feed_trips || this.state.attempts >= 9
        ? data
        : wait(1500).then(() => this.updateTripsData(username, zipcode))
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
      lastCount,
      loading,
      trips
    } = this.state

    return (
      <Comp
        {...rest}
        data={{
          attempts,
          lastCount,
          loading,
          profile,
          trips
        }}
      />
    )
  }
}

TripsDataWrapper.propTypes = {
  component: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    username: PropTypes.string
  }).isRequired,
  zipcode: PropTypes.string.isRequired
}

export default TripsDataWrapper
