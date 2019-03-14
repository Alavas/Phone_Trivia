import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
	generateUUID,
	convertImage,
	getCookie,
	updateCookie,
	loginUser,
	updateUser
} from '../utilities'
import Ad from './BannerAd'
import '../styles/home.css'

class Home extends Component {
	constructor() {
		super()
		this.state = {
			userID: '',
			loggedIn: false,
			avatar: null
		}
	}

	componentDidMount() {
		let userid = getCookie('gs_userid')
		if (userid === '' || userid === 'undefined') {
			userid = generateUUID(window.navigator.userAgent)
		}
		this.userLogin(userid)
	}

	async convertedImg(avatar) {
		await updateUser({
			userID: this.state.userID,
			avatar: avatar
		})
		this.setState({ avatar, imgReady: true })
	}

	async userLogin(userID) {
		const userDetails = await loginUser(userID)
		updateCookie(userDetails.userid)
		//If the user doesn't have an avatar generate a random one.
		if (userDetails.avatar === null) {
			convertImage(
				'https://picsum.photos/100/?random',
				this.convertedImg.bind(this)
			)
		}
		this.setState({
			userID: userDetails.userid,
			avatar: userDetails.avatar
		})
	}

	render() {
		return (
			<div className="home-container">
				<h1 className="home-title">Welcome to Phone Trivia!</h1>
				<div className="route-container">
					<Link to="/player" className="route">
						<h3>Join a Game</h3>
						<p>You'll need to scan the game QR code.</p>
					</Link>
					<Link to="/host" className="route">
						<h3>Start a Game</h3>
						<p>Create your own game, you'll be the host!</p>
					</Link>
					<Ad />
				</div>
			</div>
		)
	}
}

export default Home
