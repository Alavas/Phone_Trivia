import React, { Component } from 'react'
import { connect } from 'react-redux'
import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'
import Websocket from 'react-websocket'
import he from 'he'
import _ from 'lodash'
import { Button, ListGroup, ListGroupItem } from 'reactstrap'
import { joinGame, submitAnswer, gameStates } from '../utilities'
import { userSetScore } from '../actions/userActions'
import '../components/CountdownBar'
import '../styles/player.css'

class Player extends Component {
	constructor() {
		super()
		this.state = {
			answer: null,
			answers: [],
			answertype: '',
			correctAnswer: null,
			gameID: null,
			gamestate: null,
			joined: false,
			players: [],
			qNumber: 0,
			qStart: 0,
			question: '',
			questionID: '',
			reaction: 0,
			result: 'No Result',
			scores: [],
			showAnswer: false,
			validGame: false
		}
	}

	componentDidMount() {
		//Accessed page from the home screen.
		if (this.props.user.loggedIn) {
			this.setState({ gamestate: 0 })
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.user.loggedIn !== prevProps.user.loggedIn) {
			if (!_.isUndefined(this.props.match.params.gameKey)) {
				this.setState({ gameID: this.props.match.params.gameKey })
				this.handlePageOpened(this.props.match.params.gameKey)
			} else {
				this.setState({ gamestate: 0 })
			}
		}
	}

	async handleJoinGame(gameID) {
		if (this.props.user.loggedIn && gameID != null) {
			const userID = this.props.user.userID
			const joined = await joinGame({ userID, gameID })
			if (joined) {
				this.setState({ joined: true, gamestate: 1 })
			}
		}
	}

	async sendAnswer(answer) {
		let reaction = Date.now() - this.state.qStart
		reaction = Math.max(reaction, 1000)
		let score = Math.round(25 * (10000 / (reaction - 500)))
		score = Math.min(Math.max(score, 0), 250)
		const submission = {
			gameID: this.state.gameID,
			questionID: this.state.questionID,
			userID: this.props.user.userID,
			answer,
			reaction,
			score
		}
		document.getElementById('countdown-bar').stop()
		const result = await submitAnswer(submission)
		if (result) {
			this.setState({ answer, reaction })
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
		const dataType = Object.keys(data)
		if (dataType[0] === 'gameID') {
			this.setState({ ...data, answer: null, showAnswer: false })
			if (document.getElementById('countdown-bar')) {
				document.getElementById('countdown-bar').reset()
				document.getElementById('countdown-bar').start()
			}
		} else if (dataType[0] === 'scores') {
			var currentScore = _.find(data.scores, x => {
				return x.userid === this.props.user.userID
			})
			if (!_.isUndefined(currentScore)) {
				this.props.updateScore(currentScore.totalscore)
			} else if (this.state.gameID === null) {
				this.props.updateScore('')
			}
			this.setState({ ...data })
		} else {
			this.setState({ ...data })
		}
	}

	render() {
		return (
			<div className="player-container">
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
										ref={QrReader => {
											this.qrRef = QrReader
										}}
									/>
									<p>Scan a game QR code.</p>
								</div>
							)
						case gameStates.CREATED:
							return (
								<div className="player-ui">
									<Button color="success" size="lg">
										WAITING TO BEGIN...
									</Button>
									<div className="qr">
										<QRCode
											value={`${
												process.env.REACT_APP_GAMESHOW_ENDPOINT
											}/player/${this.state.gameID}`}
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
													this.state.showAnswer
														? this.state.correctAnswer === 'A'
															? 'correct'
															: 'wrong'
														: this.state.answer === null
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
													this.state.showAnswer
														? this.state.correctAnswer === 'B'
															? 'correct'
															: 'wrong'
														: this.state.answer === null
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
													this.state.showAnswer
														? this.state.correctAnswer === 'A'
															? 'correct'
															: 'wrong'
														: this.state.answer === null
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
													this.state.showAnswer
														? this.state.correctAnswer === 'B'
															? 'correct'
															: 'wrong'
														: this.state.answer === null
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
													this.state.showAnswer
														? this.state.correctAnswer === 'C'
															? 'correct'
															: 'wrong'
														: this.state.answer === null
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
													this.state.showAnswer
														? this.state.correctAnswer === 'D'
															? 'correct'
															: 'wrong'
														: this.state.answer === null
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
									<countdown-bar
										id="countdown-bar"
										duration={7000}
										delay={1}
									/>
								</div>
							)
						case gameStates.ENDED:
							return (
								<div className="player-ui">
									<div className="player-card">
										<h1>GAME OVER</h1>
									</div>
									<ListGroup className="player-scores">
										{_.isUndefined(this.state.scores[0]) ? null : (
											<ListGroupItem className="player-score">
												<h3
													style={{
														fontSize: '1.75em'
													}}
												>
													1<sup>st</sup> Place:
													<img
														alt="first-place"
														src={
															_.find(this.state.players, x => {
																return (
																	x.userid ===
																	this.state.scores[0].userid
																)
															}).avatar
														}
														className="avatar-scores"
													/>
													{this.state.scores[0].totalscore}
												</h3>
											</ListGroupItem>
										)}
										{_.isUndefined(this.state.scores[1]) ? null : (
											<ListGroupItem className="player-score">
												<h3
													style={{
														fontSize: '1.75em'
													}}
												>
													2<sup>nd</sup> Place:
													<img
														alt="avatar-scores"
														src={
															_.find(this.state.players, x => {
																return (
																	x.userid ===
																	this.state.scores[1].userid
																)
															}).avatar
														}
														className="avatar-scores"
													/>
													{this.state.scores[1].totalscore}
												</h3>
											</ListGroupItem>
										)}
										{_.isUndefined(this.state.scores[2]) ? null : (
											<ListGroupItem className="player-score">
												<h3 style={{ fontSize: '1.75em' }}>
													3<sup>rd</sup> Place:
													<img
														alt="third-place"
														src={
															_.find(this.state.players, x => {
																return (
																	x.userid ===
																	this.state.scores[2].userid
																)
															}).avatar
														}
														className="avatar-scores"
													/>
													{this.state.scores[2].totalscore}
												</h3>
											</ListGroupItem>
										)}
									</ListGroup>
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

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateScore: score => dispatch(userSetScore(score))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Player)
