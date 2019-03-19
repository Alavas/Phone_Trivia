import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import dotenv from 'dotenv'
import 'bootstrap/dist/css/bootstrap.min.css'

dotenv.config()

ReactDOM.render(
	<Router>
		<App />
	</Router>,
	document.getElementById('root')
)
