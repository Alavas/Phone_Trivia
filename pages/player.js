import React, { Component } from 'react'
import Nav from '../components/nav'

class Player extends Component {
	static getInitialProps({ query }) {
		return { game: query }
	}

	render() {
		console.log(this.props.game)
		return (
			<div>
				<Nav />
				<div className="title">
					<h1>Player Controller</h1>
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

export default Player
