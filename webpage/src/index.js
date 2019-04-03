import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { history, store } from './store'
import App from './App'
import dotenv from 'dotenv'
import 'bootstrap/dist/css/bootstrap.min.css'

dotenv.config()

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<App />
		</ConnectedRouter>
	</Provider>,
	document.getElementById('root')
)
