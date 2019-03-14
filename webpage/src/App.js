import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import ReactGA from 'react-ga'
import Home from './containers/Home'
import Host from './containers/Host'
import Game from './containers/Game'
import Player from './containers/Player'

class App extends Component {
	componentDidMount() {
		ReactGA.initialize('UA-108465458-2')
		ReactGA.pageview(window.location.pathname)
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location) {
			this.fireTracking()
		}
	}

	fireTracking() {
		ReactGA.pageview(window.location.pathname)
	}

	render() {
		return (
			<Switch>
				<Route exact path="/host" component={Host} />
				<Route exact path="/game" component={Game} />
				<Route exact path="/player/:gameKey" component={Player} />
				<Route exact path="/player" component={Player} />
				<Route exact path="/" component={Home} />
				<Redirect to="/" />
			</Switch>
		)
	}
}

export default withRouter(App)
