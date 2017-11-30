import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { LastLocationProvider } from 'react-router-last-location'
import { Provider as StoreProvider } from 'mobx-react'

import App from './components/App/App'
import { AppStore } from './stores'
import registerServiceWorker from './registerServiceWorker'

import './styles/index.css'

const store = AppStore.create({ profiles: {} })

ReactDOM.render(
  <StoreProvider store={store}>
    <Router>
      <LastLocationProvider>
        <App />
      </LastLocationProvider>
    </Router>
  </StoreProvider>,
  document.getElementById('root')
)

registerServiceWorker()
