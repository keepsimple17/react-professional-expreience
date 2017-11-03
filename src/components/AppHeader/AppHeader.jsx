import React from 'react'
import { Link } from 'react-router-dom'

import logo from '../../img/logo-blue.svg'

import './AppHeader.css'

const AppHeader = () => (
  <header className="app-header">
    <div className="container">
      <Link to="/">
        <img src={logo} className="logo" alt="CrisisEarth logo" />
      </Link>

    </div>
  </header>
)

export default AppHeader
