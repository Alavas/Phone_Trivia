import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import Home from './containers/Home'
import Host from './containers/Host'
import Game from './containers/Game'
import Player from './containers/Player'

class App extends Component {
	render() {
		console.log(process.env)
		return (
			<Switch>
				<Route exact path="/host" component={Host} />
				<Route exact path="/game" component={Game} />
				<Route exact path="/player" component={Player} />
				<Route exact path="/" component={Home} />
				<Redirect to="/" />
			</Switch>
		)
	}
}

export default withRouter(App)
