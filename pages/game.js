import React, { Component } from 'react'
import _ from 'lodash'
import Head from '../components/head'
import Nav from '../components/nav'
import { getGames } from '../utilities'

class Game extends Component {
	static getInitialProps({ query }) {
		return { game: query }
	}

	componentDidMount() {
		this.listGames()
	}

	async listGames() {
		const games = getGames()
	}

	render() {
		console.log(this.props.game)
		return (
			<div>
				<Head title="Gameshow" />
				<Nav />
				<div className="title">
					<h3>Game Controller</h3>
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
