import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider as StoreProvider } from 'mobx-react'

import { IntlProvider } from 'react-intl'

import App from './components/App/App'
import { AppStore } from './stores'
import registerServiceWorker from './registerServiceWorker'

import './styles/index.css'

const store = AppStore.create({ profiles: {} })

ReactDOM.render(
  <StoreProvider store={store}>
    <IntlProvider locale={navigator.language}>
      <Router>
        <App />
      </Router>
    </IntlProvider>
  </StoreProvider>,
  document.getElementById('root')
)

registerServiceWorker()
