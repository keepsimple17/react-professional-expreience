import React from 'react'

import './DownloadPromotion.css'

import appleStoreBadge from '../../img/app-store-badge.svg'

const DownloadPromotion = () => (
  <div className="download-promotion">
    <div className="container">
      <div className="row">
        <div className="col col-md-6 offset-md-6">
          <h3 className="download-heading">How do you offset your carbon?</h3>
          <p className="download-paragraph">
            When you download our app, it will ask you for your home address, average monthly energy
            bill, and begin monitoring your transportation by car, subway, or flight through your
            smartphone.
          </p>
          <p className="download-paragraph">
            As you generate carbon, we will automatically bill your credit card up to an amount you
            specify each month.
          </p>
          <p>
            <a className="link" href="https://store.apple.com">
              <img src={appleStoreBadge} className="download-badge" alt="Download on apple store" />
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default DownloadPromotion
