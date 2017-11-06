import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AppFooter from '../AppFooter/AppFooter'
import AppHeader from '../AppHeader/AppHeader'
import HomePage from '../HomePage/HomePage'

const App = () => (
  <Router>
    <div>
      <AppHeader />
      <Route exact path="/" component={HomePage} />
      <Route
        exact
        path="/profile/:username"
        render={({ match }) => `Profile of ${match.params.username}`}
      />
      <Route exact path="/download" render={() => 'Download'} />
      <AppFooter />
    </div>
  </Router>
)

export default App
