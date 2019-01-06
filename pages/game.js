import React, { Component } from 'react'
import Head from '../components/head'
import Nav from '../components/nav'

class Game extends Component {
	static getInitialProps({ query }) {
		return { game: query }
	}

	render() {
		console.log(this.props.game)
		return (
			<div>
				<Head title="Gameshow" />
				<Nav />
				<div className="title">
					<h1>Game Controller</h1>
					<h3>{this.props.game.gameKey}</h3>
				</div>
				<style jsx>{`
					.title {
						text-align: center;
						font-size: 48px;
					}
				`}</style>
			</div>
		)
	}
}

export default Game
