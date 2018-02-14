import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react'

import LazyLoad from 'react-lazyload'

import pipe from '../../util/pipe'
import ProfileRow from './ProfileRow'
import searchIcon from '../../img/icons/search.svg'
import SingleInputForm from '../SingleInputForm/SingleInputForm'

import './HomePage.css'

class HomePage extends Component {
  componentWillMount () {
    if (!this.props.store.topProducers.length) this.props.store.fetchTopProducers()
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
                  Users Producing the <strong>Most Carbon</strong>
                </h2>
              </div>
            </div>
          </div>
          {this.props.store.topProducers && this.props.store.topProducers.map((profile, i) => (
            <LazyLoad key={profile.username} height="8.5rem" offset={300}>
              <ProfileRow profile={profile} rank={i + 1} />
            </LazyLoad>
          ))}
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
    fetchTopProducers: PropTypes.func,
    topProducers: MobxPropTypes.observableArrayOf(PropTypes.shape({
      username: PropTypes.string
    }))
  }).isRequired
}

export { HomePage }

export default pipe([observer, inject('store'), withRouter])(HomePage)
