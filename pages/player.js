import React, { Component } from 'react'
import { getCookie, updateCookie, generateUUID, loginUser } from '../utilities'
import Nav from '../components/nav'

class Player extends Component {
	constructor() {
		super()
		this.state = { userid: '', loggedIn: false }
	}

	static getInitialProps({ query }) {
		return { game: query }
	}

	componentDidMount() {
		let userid = getCookie('gs_userid')
		if (userid === '' || userid === 'undefined') {
			userid = generateUUID(window.navigator.userAgent)
		}
		this.userLogin(userid)
	}

	async userLogin(userID) {
		const userDetails = await loginUser(userID)
		updateCookie(userDetails.userid)
		this.setState({ ...userDetails, loggedIn: true })
	}

	render() {
		return (
			<div>
				<Nav />
				<div className="title">
					<h1>Player Controller</h1>
					<h3>{this.props.game.gameKey}</h3>
					<h5>{this.state.userid}</h5>
					<h6 style={this.state.loggedIn ? null : { display: 'none' }}>
						Logged In
					</h6>
				</div>
				<style jsx>{`
					.title {
						text-align: center;
					}
				`}</style>
			</div>
		)
	}
}

export default Player
