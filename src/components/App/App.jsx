import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AppHeader from '../AppHeader/AppHeader'

const App = () => (
  <Router>
    <div>
      <AppHeader />
      <Route exact path="/" render={() => 'Home'} />
      <Route
        exact
        path="/profile/:username"
        render={({ match }) => `Profile of ${match.params.username}`}
      />
      <Route exact path="/download" render={() => 'Download'} />
    </div>
  </Router>
)

export default App
