import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import SingleInputForm from '../SingleInputForm/SingleInputForm'
import searchIcon from '../../img/icons/search.svg'

import './HomePage.css'

const HomePage = ({ history }) => (
  <section className="home-page">
    <section className="search-hero">
      <div className="container">
        <div className="row">
          <div className="col">
            <h2 className="title text-center">
              Enter an Instagram username to begin:
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <SingleInputForm
              iconUrl={searchIcon}
              placeholder="asimon9633"
              onSubmit={(event, username) => history.push(`/profile/${username}`)}
            />
          </div>
        </div>
      </div>
    </section>
  </section>
)

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
}

export { HomePage }

export default withRouter(HomePage)
