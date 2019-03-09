import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import Websocket from 'react-websocket'
import QrReader from 'react-qr-reader'
import {
	getCookie,
	updateCookie,
	generateUUID,
	loginUser,
	convertImage,
	joinGame,
	submitAnswer,
	gameStates,
	updateUser
} from '../utilities'
import Nav from '../components/Nav'

class Player extends Component {
	constructor() {
		super()
		this.state = {
			userID: '',
			avatar: null,
			result: 'No Result',
			validGame: false,
			gamestate: gameStates.QUESTIONS,
			gameID: '',
			answer: null,
			qNumber: 0,
			qStart: 0,
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

	async convertedImg(avatar) {
		await updateUser({
			userID: this.state.userID,
			avatar
		})
		this.setState({ avatar, imgReady: true })
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
		//If the user doesn't have an avatar generate a random one.
		if (userDetails.avatar === null) {
			convertImage(
				'https://picsum.photos/250/?random',
				this.convertedImg.bind(this)
			)
		}
		this.setState({
			userID: userDetails.userid,
			avatar: userDetails.avatar,
			score: userDetails.score
		})
		return true
	}

	async sendAnswer(answer) {
		let reaction = Date.now() - this.state.qStart
		reaction = Math.max(reaction, 1000)
		let score = Math.round(25 * (10000 / (reaction - 500)))
		score = Math.min(Math.max(score, 0), 250)
		const submission = {
			gameID: this.state.gameID,
			questionID: this.state.questionID,
			userID: this.state.userID,
			answer,
			reaction,
			score
		}
		const result = submitAnswer(submission)
		if (result) {
			this.setState({ answer })
		}
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
		data = JSON.parse(data)
		this.setState({ ...data, answer: null })
	}

	render() {
		if (this.state.gamestate === gameStates.RESET) {
			window.location = process.env.REACT_APP_GAMESHOW_ENDPOINT
		}
		return (
			<div>
				{this.state.gamestate !== gameStates.ENDED ? (
					<Nav avatar={this.state.avatar} />
				) : null}
				{this.state.joined ? (
					<Websocket
						url={process.env.REACT_APP_GAMESHOW_WEBSOCKET}
						protocol={this.props.gameID}
						onMessage={this.handleData.bind(this)}
					/>
				) : null}
				{(() => {
					switch (this.state.gamestate) {
						case gameStates.NOTSTARTED:
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
						case gameStates.CREATED:
							return (
								<div className="row">
									<a className="card">
										<h3>WAITING TO BEGIN...</h3>
									</a>
									<div className="qr">
										<QRCode
											value={`${
												process.env.REACT_APP_GAMESHOW_ENDPOINT
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
						case gameStates.STARTED:
							return (
								<div className="row">
									<a className="card">
										<h3>Waiting for a question...</h3>
									</a>
								</div>
							)
						case gameStates.QUESTIONS:
							return (
								<div className="row">
									<h3>Question Number {this.state.qNumber}</h3>
									{this.state.answertype === 'boolean' ? (
										<React.Fragment>
											<a
												style={{
													backgroundColor: '#FFF0000'
												}}
												className={
													this.state.answer === null
														? 'card'
														: this.state.answer === 'A'
														? 'card answer'
														: 'card disabled'
												}
												onClick={() => this.sendAnswer('A')}
											>
												<h3>TRUE</h3>
											</a>
											<a
												style={{ backgroundColor: '#0000FF' }}
												className={
													this.state.answer === null
														? 'card'
														: this.state.answer === 'B'
														? 'card answer'
														: 'card disabled'
												}
												onClick={() => this.sendAnswer('B')}
											>
												<h3>FALSE</h3>
											</a>
										</React.Fragment>
									) : (
										<React.Fragment>
											<a
												style={{ backgroundColor: '#24d678' }}
												className={
													this.state.answer === null
														? 'card'
														: this.state.answer === 'A'
														? 'card answer'
														: 'card disabled'
												}
												onClick={() => this.sendAnswer('A')}
											>
												<h3>A</h3>
											</a>
											<a
												style={{ backgroundColor: '#2789c2' }}
												className={
													this.state.answer === null
														? 'card'
														: this.state.answer === 'B'
														? 'card answer'
														: 'card disabled'
												}
												onClick={() => this.sendAnswer('B')}
											>
												<h3>B</h3>
											</a>
											<a
												style={{ backgroundColor: '#fbcb00' }}
												className={
													this.state.answer === null
														? 'card'
														: this.state.answer === 'C'
														? 'card answer'
														: 'card disabled'
												}
												onClick={() => this.sendAnswer('C')}
											>
												<h3>C</h3>
											</a>
											<a
												style={{ backgroundColor: '#f2493f' }}
												className={
													this.state.answer === null
														? 'card'
														: this.state.answer === 'D'
														? 'card answer'
														: 'card disabled'
												}
												onClick={() => this.sendAnswer('D')}
											>
												<h3>D</h3>
											</a>
										</React.Fragment>
									)}
								</div>
							)
						case gameStates.ENDED:
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
					:global(html) {
						width: 100vw;
						height: 100vhnav;
						font-size: 12px !important;
					}
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
						border: 1px solid #9b9b9b;
					}
					.card:hover {
						border-color: #067df7;
					}
					.card p {
						margin: 0;
						padding: 12px 0 0;
						font-size: 13px;
						color: #000000;
					}
					.card h3 {
						color: black !important;
					}
					.disabled {
						pointer-events: none;
						cursor: not-allowed;
						opacity: 0.25;
						filter: alpha(opacity=25);
						-webkit-box-shadow: none;
						box-shadow: none;
					}
					.answer {
						pointer-events: none;
						cursor: not-allowed;
						box-shadow: none;
						border: 3px solid #9b9b9b;
					}
				`}</style>
			</div>
		)
	}
}

export default Player
