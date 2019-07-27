import React, { Component } from 'react'
import { connect } from 'react-redux'
import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'
import he from 'he'
import _ from 'lodash'
import { Button, ListGroup, ListGroupItem } from 'reactstrap'
import { gameStates } from '../utilities'
import {
	gameStateUpdate,
	gameJoin,
	gameSubmitAnswer
} from '../actions/gameActions'
import '../components/CountdownBar'
import '../styles/player.css'
import InviteButton from '../components/InviteButton'

class Player extends Component {
	componentDidMount() {
		//Accessed page from the home screen.
		if (this.props.user.loggedIn) {
			this.props.updateGameState(gameStates.NOTSTARTED)
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.user.loggedIn !== prevProps.user.loggedIn) {
			if (!_.isUndefined(this.props.match.params.gameKey)) {
				const gameID = this.props.match.params.gameKey
				this.props.joinGame(gameID)
			} else {
				this.props.updateGameState(gameStates.NOTSTARTED)
			}
		}
	}

	handleScan = data => {
		const regex = RegExp(
			'(.*/player/)([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})'
		)
		if (data) {
			//Regex to confirm that the link is valid.
			if (regex.test(data)) {
				//Redirect to the game URL.
				window.location = data
			}
		}
	}

	handleError = err => {
		console.error(err)
	}

	render() {
		return (
			<div className="player-container">
				{(() => {
					switch (this.props.game.gamestate) {
						case gameStates.NOTSTARTED:
							return (
								<div className="player-ui-flex">
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
								<div className="player-ui-grid">
									<Button
										color="success"
										size="lg"
										style={{ gridArea: '2/2/3/3' }}
									>
										Waiting To Begin
									</Button>
									<div
										style={{
											gridArea: '4/2/5/3',
											textAlign: 'center'
										}}
									>
										<QRCode
											value={`${
												process.env.REACT_APP_GAMESHOW_ENDPOINT
											}/player/${this.props.game.gameID}`}
											size={225}
											bgColor={'#ffffff'}
											fgColor={'#000000'}
											level={'L'}
											includeMargin={true}
											renderAs={'svg'}
										/>
									</div>
									<InviteButton
										token={this.props.user.token}
										gameID={this.props.game.gameID}
									/>
								</div>
							)
						case gameStates.STARTED:
							return (
								<div className="player-ui-flex">
									<div className="player-card">
										<h3>Get ready!</h3>
									</div>
								</div>
							)
						case gameStates.QUESTIONS:
							return (
								<div className="player-ui-flex">
									<h3>Question {this.props.game.qNumber}</h3>
									<h5>{he.decode(this.props.game.question)}</h5>
									{this.props.game.answertype === 'boolean' ? (
										<React.Fragment>
											<Button
												color="success"
												size="lg"
												className={
													this.props.game.showAnswer
														? this.props.game.correctAnswer ===
														  'A'
															? 'correct'
															: 'wrong'
														: this.props.game.answer === null
														? ''
														: this.props.game.answer === 'A'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.props.submitAnswer('A')}
											>
												TRUE
											</Button>
											<Button
												color="danger"
												size="lg"
												className={
													this.props.game.showAnswer
														? this.props.game.correctAnswer ===
														  'B'
															? 'correct'
															: 'wrong'
														: this.props.game.answer === null
														? ''
														: this.props.game.answer === 'B'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.props.submitAnswer('B')}
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
													this.props.game.showAnswer
														? this.props.game.correctAnswer ===
														  'A'
															? 'correct'
															: 'wrong'
														: this.props.game.answer === null
														? ''
														: this.props.game.answer === 'A'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.props.submitAnswer('A')}
											>
												{he.decode(this.props.game.answers[0])}
											</Button>
											<Button
												color="primary"
												size="lg"
												className={
													this.props.game.showAnswer
														? this.props.game.correctAnswer ===
														  'B'
															? 'correct'
															: 'wrong'
														: this.props.game.answer === null
														? ''
														: this.props.game.answer === 'B'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.props.submitAnswer('B')}
											>
												{he.decode(this.props.game.answers[1])}
											</Button>
											<Button
												color="warning"
												size="lg"
												className={
													this.props.game.showAnswer
														? this.props.game.correctAnswer ===
														  'C'
															? 'correct'
															: 'wrong'
														: this.props.game.answer === null
														? ''
														: this.props.game.answer === 'C'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.props.submitAnswer('C')}
											>
												{he.decode(this.props.game.answers[2])}
											</Button>
											<Button
												color="danger"
												size="lg"
												className={
													this.props.game.showAnswer
														? this.props.game.correctAnswer ===
														  'D'
															? 'correct'
															: 'wrong'
														: this.props.game.answer === null
														? ''
														: this.props.game.answer === 'D'
														? 'answer'
														: 'disabled'
												}
												onClick={() => this.props.submitAnswer('D')}
											>
												{he.decode(this.props.game.answers[3])}
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
								<div className="player-ui-flex">
									<div className="player-card">
										<h1>GAME OVER</h1>
									</div>
									<ListGroup className="player-scores">
										{_.isUndefined(
											this.props.game.scores[0]
										) ? null : (
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
															_.find(
																this.props.game.players,
																x => {
																	return (
																		x.userid ===
																		this.props.game.scores[0]
																			.userid
																	)
																}
															).avatar
														}
														className="avatar-scores"
													/>
													{this.props.game.scores[0].totalscore}
												</h3>
											</ListGroupItem>
										)}
										{_.isUndefined(
											this.props.game.scores[1]
										) ? null : (
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
															_.find(
																this.props.game.players,
																x => {
																	return (
																		x.userid ===
																		this.props.game.scores[1]
																			.userid
																	)
																}
															).avatar
														}
														className="avatar-scores"
													/>
													{this.props.game.scores[1].totalscore}
												</h3>
											</ListGroupItem>
										)}
										{_.isUndefined(
											this.props.game.scores[2]
										) ? null : (
											<ListGroupItem className="player-score">
												<h3 style={{ fontSize: '1.75em' }}>
													3<sup>rd</sup> Place:
													<img
														alt="third-place"
														src={
															_.find(
																this.props.game.players,
																x => {
																	return (
																		x.userid ===
																		this.props.game.scores[2]
																			.userid
																	)
																}
															).avatar
														}
														className="avatar-scores"
													/>
													{this.props.game.scores[2].totalscore}
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
		game: state.game,
		user: state.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		joinGame: gameID => dispatch(gameJoin(gameID)),
		submitAnswer: answer => dispatch(gameSubmitAnswer(answer)),
		updateGameState: gamestate => dispatch(gameStateUpdate(gamestate))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Player)
