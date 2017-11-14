import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import api from '../../api'
import SingleInputForm from '../SingleInputForm/SingleInputForm'
import ProfileRow from './ProfileRow'
import searchIcon from '../../img/icons/search.svg'

import './HomePage.css'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      topProducers: []
    }
  }

  async componentWillMount () {
    const topProducers = await api.fetchTopProducers()

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
                  onSubmit={(event, username) => this.props.history.push(`/profile/${username}`)}
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
            {this.state.topProducers.map(profile => <ProfileRow profile={profile} />)}
          </div>
        </section>
      </section>
    )
  }
}

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
}

export { HomePage }

export default withRouter(HomePage)
