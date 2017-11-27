import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'

import AppFooter from '../AppFooter/AppFooter'
import AppHeader from '../AppHeader/AppHeader'
import HomePage from '../HomePage/HomePage'
import DownloadPage from '../DownloadPage/DownloadPage'
import ProfilePage from '../ProfilePage/ProfilePage'

import './app.css'

const App = () => (
  <Router>
    <LastLocationProvider>
      <div className="app">
        <AppHeader />
        <section className="app-content">
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/profile/:username"
            render={({ match }) => <ProfilePage username={match.params.username} />}
          />
          <Route exact path="/download" component={DownloadPage} />
        </section>
        <AppFooter />
      </div>
    </LastLocationProvider>
  </Router>
)

export default App
