import React from 'react'

import DownloadPromotion from '../DownloadPromotion/DownloadPromotion'

import appleStoreBadge from '../../img/app-store-badge.svg'
import iphoneApp from '../../img/iphone-app.png'

import './DownloadPage.css'

const DownloadPage = () => (
  <div className="download-page">
    <div className="download-page-hero">
      <div className="container">
        <div className="row">
          <div className="col col-md-6">
            <h3 className="hero-heading">Want to go carbon netural? Here&apos;s how!</h3>
            <p className="hero-paragraph">
              {`
                Download crisis:earth on App Store to track where you're going and how much carbon
                you're using. Then pay less than $20 per month* to offset it.
              `}
            </p>
            <p className="hero-paragraph">
              {`
                We'll automatically update your public profile to let everyone know that you're now
                carbon neutral.
              `}
            </p>
            <p className="hero-disclaimer">(*) Based on the average user.</p>
            <p>
              <a className="link" href="https://store.apple.com">
                <img
                  src={appleStoreBadge}
                  className="download-badge"
                  alt="Download on apple store"
                />
              </a>
            </p>
          </div>
          <div className="col col-md-6 text-center">
            <img className="iphone-app" src={iphoneApp} alt="iPhone app" />
          </div>
        </div>
      </div>
    </div>
    <DownloadPromotion />
  </div>
)

export default DownloadPage
