import React from 'react'
import { Link } from 'react-router-dom'

import appleStoreBadge from '../../img/app-store-badge.svg'

import './AppFooter.css'

const AppFooter = () => (
  <footer className="app-footer text-center text-md-left">
    <div className="container">
      <div className="row justify-content-between align-items-center">
        <div className="col-12 col-md-auto">
          <ul className="linklist">
            <li className="item d-md-none">
              <a className="link" href="https://store.apple.com">
                <img
                  src={appleStoreBadge}
                  className="download-badge"
                  alt="Download on apple store"
                />
              </a>
            </li>
            <li className="item d-md-inline-block">
              <Link className="link" to="/terms">
                <small>Terms of use</small>
              </Link>
            </li>
            <li className="item d-md-inline-block">
              <Link className="link" to="/privacy">
                <small>Privacy policy</small>
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-12 col-md-auto order-md-first">
          <p className="copyright">
            <small>© copyright 2017 cirsis:earth - all rights reserved</small>
          </p>
        </div>
      </div>
    </div>
  </footer>
)

export default AppFooter
