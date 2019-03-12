import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import Websocket from 'react-websocket'
import { withRouter } from 'react-router-dom'
import QrReader from 'react-qr-reader'
import { Alert, Button } from 'reactstrap'
import he from 'he'
import _ from 'lodash'
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
import '../styles/player.css'

class Player extends Component {
	constructor() {
		super()
		this.state = {
			userID: '',
			avatar: null,
			result: 'No Result',
			validGame: false,
			gamestate: null,
			gameID: null,
			answer: null,
			qNumber: 0,
			qStart: 0,
			questionID: '',
			question: '',
			answers: [],
			joined: false
			//scores: []
		}
	}

	componentDidMount() {
		if (!_.isUndefined(this.props.match.params.gameKey)) {
			this.setState({ gameID: this.props.match.params.gameKey })
		}
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
		if (loggedIn && this.state.gameID != null) {
			const gameID = this.state.gameID
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
			avatar: userDetails.avatar
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
		const result = await submitAnswer(submission)
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
		var currentScore = _.find(this.state.scores, x => {
			return x.userid === this.state.userID
		})
		if (!_.isUndefined(currentScore)) {
			currentScore = currentScore.totalscore
		} else if (this.state.gameID === null) {
			currentScore = ''
		} else {
			currentScore = 0
		}
		return (
			<div className="player-container">
				<Nav avatar={this.state.avatar} score={currentScore} />
				{this.state.joined ? (
					<Websocket
						url={process.env.REACT_APP_GAMESHOW_WEBSOCKET}
						protocol={this.state.gameID}
						onMessage={this.handleData.bind(this)}
					/>
				) : null}
				{(() => {
					switch (this.state.gamestate) {
						case gameStates.NOTSTARTED:
							return (
								<div className="player-ui">
									<QrReader
										delay={300}
										onError={this.handleError}
										onScan={this.handleScan}
										className="qr-reader"
									/>
									<p>Scan a game QR code.</p>
								</div>
							)
						case gameStates.CREATED:
							return (
								<div className="player-ui">
									<Alert color="success" size="lg">
										WAITING TO BEGIN...
									</Alert>
									<div className="qr">
										<QRCode
											value={`${
												process.env.REACT_APP_GAMESHOW_ENDPOINT
											}/player/${this.props.gameID}`}
											size={225}
											bgColor={'#ffffff'}
											fgColor={'#000000'}
											level={'L'}
											includeMargin={true}
											renderAs={'svg'}
										/>
									</div>
									<Button color="danger" size="lg">
										LEAVE GAME
									</Button>
								</div>
							)
						case gameStates.STARTED:
							return (
								<div className="player-ui">
									<div className="player-card">
										<h3>Get ready!</h3>
									</div>
								</div>
							)
						case gameStates.QUESTIONS:
							return (
								<div className="player-ui">
									<h3>Question {this.state.qNumber}</h3>
									<h5>{he.decode(this.state.question)}</h5>
									{this.state.answertype === 'boolean' ? (
										<React.Fragment>
											<Button
												color="success"
												size="lg"
												className={
													this.state.answer === null
														? ''
														: this.state.answer === 'A'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.sendAnswer('A')}
											>
												TRUE
											</Button>
											<Button
												color="danger"
												size="lg"
												className={
													this.state.answer === null
														? ''
														: this.state.answer === 'B'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.sendAnswer('B')}
											>
												FALSE
											</Button>
										</React.Fragment>
									) : (
										<React.Fragment>
											<Button
												color="success"
												size="lg"
												className={
													this.state.answer === null
														? ''
														: this.state.answer === 'A'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.sendAnswer('A')}
											>
												{he.decode(this.state.answers[0])}
											</Button>
											<Button
												color="primary"
												size="lg"
												className={
													this.state.answer === null
														? ''
														: this.state.answer === 'B'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.sendAnswer('B')}
											>
												{he.decode(this.state.answers[1])}
											</Button>
											<Button
												color="warning"
												size="lg"
												className={
													this.state.answer === null
														? ''
														: this.state.answer === 'C'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.sendAnswer('C')}
											>
												{he.decode(this.state.answers[2])}
											</Button>
											<Button
												color="danger"
												size="lg"
												className={
													this.state.answer === null
														? ''
														: this.state.answer === 'D'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.sendAnswer('D')}
											>
												{he.decode(this.state.answers[3])}
											</Button>
										</React.Fragment>
									)}
								</div>
							)
						case gameStates.ENDED:
							return (
								<div className="player-ui">
									<div className="player-card">
										<h1>GAME OVER</h1>
									</div>
								</div>
							)
						default:
							return null
					}
				})()}
			</div>
		)
	}
}

export default withRouter(Player)
