import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap-reboot.css'
import 'griddity/griddity.css'
import './styles/index.css'

import App from './components/App/App'
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()
