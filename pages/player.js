if (typeof window != 'undefined') {
	var QrReader = require('react-qr-reader')
}

import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import Websocket from 'react-websocket'
import {
	getCookie,
	updateCookie,
	generateUUID,
	loginUser,
	joinGame
} from '../utilities'
import Head from '../components/head'
import Nav from '../components/nav'

/*{gameID: "b467a78b-ec9d-45e7-a595-d6903c9ddc22", gamestate: 3, qNumber: 1, questionID: "f006b954-1d86-4a48-8752-05e150430418", answertype: "multiple"} */

class Player extends Component {
	constructor() {
		super()
		this.state = {
			userID: '',
			result: 'No Result',
			validGame: false,
			gamestate: null,
			gameID: '',
			qNumber: 0,
			questionID: '',
			answertype: '',
			joined: false
		}
	}

	static getInitialProps({ query }) {
		return { gameID: query.gameKey }
	}

	componentDidMount() {
		this.handlePageOpened()
	}

	async handlePageOpened() {
		let userID = getCookie('gs_userid')
		if (userID === '' || userID === 'undefined') {
			userID = generateUUID(window.navigator.userAgent)
		}
		const loggedIn = await this.userLogin(userID)
		if (loggedIn && this.props.gameID != null) {
			const gameID = this.props.gameID
			const joined = await joinGame({ userID, gameID })
			if (joined) {
				this.setState({ joined: true, gamestate: 1 })
			}
		} else {
			this.setState({ gamestate: 0 })
		}
	}

	async userLogin(userID) {
		const userDetails = await loginUser(userID)
		updateCookie(userDetails.userid)
		this.setState({ ...userDetails })
		return true
	}

	handleScan = data => {
		const regex = RegExp(
			'(.*/player/)([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})'
		)
		if (data) {
			//Regex to confirm that the link is valid.
			if (regex.test(data)) {
				this.setState({
					result: data,
					validGame: true
				})
				//Redirect to the game URL.
				window.location = data
			} else {
				this.setState({ validGame: false })
			}
		}
	}

	handleError = err => {
		console.error(err)
	}

	handleData(data) {
		let game = JSON.parse(data)
		this.setState({ ...game })
		console.log(game)
	}

	render() {
		return (
			<div>
				<Head title="Gameshow" />
				{this.state.gamestate !== 4 ? <Nav /> : null}
				{this.state.joined ? (
					<Websocket
						url={process.env.GAMESHOW_ENDPOINT}
						protocol={this.props.gameID}
						onMessage={this.handleData.bind(this)}
					/>
				) : null}
				{(() => {
					switch (this.state.gamestate) {
						case 0:
							return (
								<div className="row">
									{QrReader ? (
										<QrReader
											delay={300}
											onError={this.handleError}
											onScan={this.handleScan}
											style={{ width: '100%' }}
											className="card"
										/>
									) : null}
									{this.state.validGame ? (
										<p>JOIN</p>
									) : (
										<p>Scan a game QR code.</p>
									)}
								</div>
							)
						case 1:
							return (
								<div className="row">
									<a className="card">
										<h3>WAITING TO BEGIN...</h3>
									</a>
									<div className="qr">
										<QRCode
											value={`${
												process.env.GAMESHOW_ENDPOINT
											}/player/${this.props.gameID}`}
											size={225}
											bgColor={'#ffffff'}
											fgColor={'#000000'}
											level={'L'}
											includeMargin={false}
											renderAs={'svg'}
										/>
									</div>
									<a className="card">
										<h3>LEAVE GAME</h3>
									</a>
								</div>
							)
						case 2:
							return (
								<div className="row">
									<a className="card">
										<h3>Waiting for a question...</h3>
									</a>
								</div>
							)
						case 3:
							return (
								<div className="row">
									<h3>Question Number {this.state.qNumber}</h3>
									{this.state.answertype === 'boolean' ? (
										<React.Fragment>
											<a className="card">
												<h3>TRUE</h3>
											</a>
											<a className="card">
												<h3>FALSE</h3>
											</a>
										</React.Fragment>
									) : (
										<React.Fragment>
											<a className="card">
												<h3>A</h3>
											</a>
											<a className="card">
												<h3>B</h3>
											</a>
											<a className="card">
												<h3>C</h3>
											</a>
											<a className="card">
												<h3>D</h3>
											</a>
										</React.Fragment>
									)}
								</div>
							)
						case 4:
							return (
								<div className="row">
									<a className="card">
										<h1>GAME OVER</h1>
									</a>
								</div>
							)
						default:
							return null
					}
				})()}

				<style jsx>{`
					.row {
						max-width: 60%;
						margin-left: auto;
						margin-right: auto;
						display: flex;
						flex-direction: column;
						justify-content: center;
						height: calc(100vh - 68.3px);
					}
					.qr {
						margin-bottom: 25px;
						text-align: center;
					}
					.card {
						padding: 18px 18px 24px;
						margin-bottom: 25px;
						text-decoration: none;
						text-align: center;
						color: #067df7;
						border: 1px solid #9b9b9b;
					}
					.card:hover {
						border-color: #067df7;
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

export default Player
