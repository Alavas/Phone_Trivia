import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import ReactGA from 'react-ga'
import Home from './components/Home'
import Host from './containers/Host'
import Game from './containers/Game'
import Player from './containers/Player'
import Nav from './containers/Nav'

class App extends Component {
	componentDidMount() {
		ReactGA.initialize('UA-108465458-2')
		ReactGA.pageview(window.location.pathname)
	}
	componentDidUpdate(prevProps) {
		if (
			this.props.location.pathname !== prevProps.location &&
			process.env.NODE_ENV === 'production'
		) {
			this.fireTracking()
		}
	}

	fireTracking() {
		ReactGA.pageview(window.location.pathname)
	}

	render() {
		return (
			<React.Fragment>
				<Nav />
				<Switch>
					<Route exact path="/host" component={Host} />
					<Route exact path="/game" component={Game} />
					<Route exact path="/player/:gameKey" component={Player} />
					<Route exact path="/player" component={Player} />
					<Route exact path="/" component={Home} />
					<Redirect to="/" />
				</Switch>
			</React.Fragment>
		)
	}
}

export default withRouter(App)
