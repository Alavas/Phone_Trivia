import React, { Component } from 'react'
import Link from 'next/link'
import Head from '../components/head'
import { getCookie, updateCookie, loginUser } from '../utilities'

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
				'https://picsum.photos/250/?random',
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
			<div>
				<Head title="Gameshow" />

				<div className="hero">
					<h1 className="title">Welcome to Phone Trivia!</h1>
					<p className="description">
						You can either join an existing game, display a scoreboard, or
						start a new game.
					</p>

					<div className="row">
						<Link href="/player">
							<a className="card">
								<h3>Join a Game</h3>
								<p>
									You'll need access to the game QR code or the unique
									game ID.
								</p>
							</a>
						</Link>
						<Link href="/game">
							<a className="card">
								<h3>Display a gameboard</h3>
								<p>You'll need the unique game board ID.</p>
							</a>
						</Link>
						<Link href="/host">
							<a className="card">
								<h3>Start a Game</h3>
								<p>Create you own game, you'll be the host!</p>
							</a>
						</Link>
					</div>
				</div>

				<style jsx>{`
					.hero {
						width: 100%;
						color: #333;
					}
					.title {
						margin: 0;
						width: 100%;
						padding-top: 80px;
						line-height: 1.15;
						font-size: 48px;
					}
					.title,
					.description {
						text-align: center;
					}
					.row {
						max-width: 880px;
						margin: 80px auto 40px;
						display: flex;
						flex-direction: row;
						justify-content: space-around;
					}
					.card {
						padding: 18px 18px 24px;
						width: 220px;
						text-align: left;
						text-decoration: none;
						color: #434343;
						border: 1px solid #9b9b9b;
					}
					.card:hover {
						border-color: #067df7;
					}
					.card h3 {
						margin: 0;
						color: #067df7;
						font-size: 18px;
					}
					.card p {
						margin: 0;
						padding: 12px 0 0;
						font-size: 13px;
						color: #333;
					}
				`}</style>
			</div>
		)
	}
}

export default Home
