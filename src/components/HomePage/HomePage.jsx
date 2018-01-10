import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import LazyLoad from 'react-lazyload'

import pipe from '../../util/pipe'
import ProfileRow from './ProfileRow'
import searchIcon from '../../img/icons/search.svg'
import SingleInputForm from '../SingleInputForm/SingleInputForm'

import './HomePage.css'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topProducers: []
    }
  }

  async componentWillMount () {
    const topProducers = await this.props.store.fetchTopProducers()

    topProducers.forEach(profile => profile.trips.pullTrips(5))

    this.setState(() => ({
      topProducers: topProducers || []
    }))
  }

  render () {
    return (
      <section className="home-page">
        <section className="search-hero">
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="search-hero-title text-center">
                  Enter an Instagram username to begin:
                </h2>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SingleInputForm
                  iconUrl={searchIcon}
                  placeholder="example: goodlife"
                  required
                  pattern="[A-Za-z0-9_]{3,}"
                  onSubmit={(event, username) =>
                    this.props.history.push(`/profile/${username.toLowerCase()}`)
                  }
                />
              </div>
            </div>
          </div>
        </section>
        <section className="top-producers">
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="top-producers-heading">
                  Worst carbon producers who are not offsetting
                </h2>
              </div>
            </div>
            {this.state.topProducers.map(profile => (
              <LazyLoad key={profile.username} height="8.5rem" offset={300}>
                <ProfileRow profile={profile} />
              </LazyLoad>
            ))}
          </div>
        </section>
      </section>
    )
  }
}

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  store: PropTypes.shape({
    fetchTopProducers: PropTypes.func
  }).isRequired
}

export { HomePage }

export default pipe([observer, inject('store'), withRouter])(HomePage)
