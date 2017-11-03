import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../../img/logo-blue.svg'
import appleStoreBadge from '../../img/app-store-badge.svg'

import './AppHeader.css'

const AppHeader = () => (
  <header className="app-header text-center text-md-left">
    <div className="container">
      <div className="row justify-content-between align-items-center">
        <div className="col-12 col-md-auto">
          <Link to="/">
            <img src={logo} className="logo" alt="CrisisEarth logo" />
          </Link>
        </div>
        <div className="col-12 col-md-auto d-none d-md-flex">
          <p className="offer">
            Track and offset your carbon footprint
            <a href="https://store.apple.com">
              <img src={appleStoreBadge} className="download-badge" alt="Download on apple store" />
            </a>
          </p>
        </div>
      </div>
    </div>
  </header>
)

export default AppHeader
