import React, { Component } from 'react'
import { connect } from 'react-redux'
import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'
import he from 'he'
import _ from 'lodash'
import {
	Button,
	Col,
	Form,
	FormGroup,
	Input,
	Label,
	ListGroup,
	ListGroupItem,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Row
} from 'reactstrap'
import {
	gameCategories,
	gameDifficulties,
	questionType,
	updateGame,
	connectGameboard,
	submitAnswer,
	gameStates
} from '../utilities'
import { userSetScore } from '../actions/userActions'
import '../components/CountdownBar'
import '../styles/host.css'
import {
	gameJoin,
	gameStateUpdate,
	gameShowAnswer,
	gameUpdateAnswer,
	gameEnd
} from '../actions/gameActions'
import { hostCreateGame, hostToggleModal } from '../actions/hostActions'

class Host extends Component {
	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
		this.amount = React.createRef()
		this.category = React.createRef()
		this.difficulty = React.createRef()
		this.type = React.createRef()
		this.hostPlay = React.createRef()
		this.handleScan = this.handleScan.bind(this)
	}

	componentDidMount() {
		//Accessed page from the home screen.
		if (this.props.user.loggedIn) {
			this.props.updateGameState(gameStates.NOTSTARTED)
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.user.loggedIn !== prevProps.user.loggedIn) {
			this.props.updateGameState(gameStates.NOTSTARTED)
		}
	}

	async submit(e) {
		e.preventDefault()
		const gameSettings = {
			amount: this.amount.current.value,
			category: this.category.current.value,
			difficulty: this.difficulty.current.value,
			type: this.type.current.value,
			host: this.props.user.userID,
			hostPlay: this.hostPlay.current.value === 'true'
		}
		this.props.createGame(gameSettings)
	}

	async startGame(delay) {
		if (this.props.host.hostPlay) {
			do {
				await this.nextQuestion()
				await new Promise(resolve => setTimeout(resolve, delay))
				this.props.showAnswer()
				await new Promise(resolve => setTimeout(resolve, 1500))
			} while (this.props.game.qNumber < this.props.host.amount)
			await this.nextQuestion()
		} else {
			this.nextQuestion()
		}
	}

	async nextQuestion() {
		const qNumber = this.props.game.qNumber + 1
		const gameID = this.props.game.gameID
		if (qNumber > this.props.host.amount) {
			await updateGame({ gamestate: gameStates.ENDED, gameID })
		} else {
			await updateGame({
				gamestate: gameStates.QUESTIONS,
				gameID,
				qNumber
			})
		}
	}

	async sendAnswer(answer) {
		let reaction = Date.now() - this.props.game.qStart
		reaction = Math.max(reaction, 1000)
		let score = Math.round(25 * (10000 / (reaction - 500)))
		score = Math.min(Math.max(score, 0), 250)
		const submission = {
			gameID: this.props.game.gameID,
			questionID: this.props.game.questionID,
			userID: this.props.user.userID,
			answer,
			reaction,
			score
		}
		document.getElementById('countdown-bar').stop()
		const result = await submitAnswer(submission)
		if (result) {
			this.setState({ answer })
			this.props.updateAnswer(answer)
		}
	}

	handleScan(data) {
		const regex = RegExp(
			'[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'
		)
		if (data) {
			//Regex to confirm that the link is valid.
			if (regex.test(data)) {
				const gameID = this.props.game.gameID
				connectGameboard({ userID: data, gameID })
				this.props.toggleModal()
			}
		}
	}

	handleError(err) {
		console.error(err)
	}

	toggleModal() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}))
	}

	render() {
		return (
			<div className="host-container">
				{(() => {
					switch (this.props.game.gamestate) {
						case gameStates.NOTSTARTED:
							return (
								<div className="host-ui">
									<h3>Choose Game Options</h3>
									<Form onSubmit={this.submit}>
										<Row form>
											<Col xs={5}>
												<FormGroup>
													<Label>Number of Questions</Label>
													<Input
														type="number"
														name="amount"
														min="10"
														max="50"
														defaultValue="10"
														innerRef={this.amount}
													/>
												</FormGroup>
											</Col>
											<Col xs={7}>
												<FormGroup>
													<Label>Question type?</Label>
													<Input
														type="select"
														innerRef={this.type}
													>
														{questionType.map((choice, index) => {
															return (
																<option
																	key={index}
																	value={choice.value}
																>
																	{choice.display}
																</option>
															)
														})}
													</Input>
												</FormGroup>
											</Col>
										</Row>
										<FormGroup>
											<Label>Category</Label>
											<Input
												type="select"
												name="category"
												innerRef={this.category}
											>
												{gameCategories.map((choice, index) => {
													return (
														<option
															key={index}
															value={choice.value}
														>
															{choice.display}
														</option>
													)
												})}
											</Input>
										</FormGroup>
										<FormGroup>
											<Row form>
												<Col xs={8}>
													<Label>Difficulty</Label>
													<Input
														type="select"
														innerRef={this.difficulty}
													>
														{gameDifficulties.map(
															(choice, index) => {
																return (
																	<option
																		key={index}
																		value={choice.value}
																	>
																		{choice.display}
																	</option>
																)
															}
														)}
													</Input>
												</Col>
												<Col xs={4}>
													<Label>Are you playing?</Label>
													<Input
														type="select"
														innerRef={this.hostPlay}
													>
														<option key="true" value={true}>
															Yes
														</option>
														<option key="false" value={false}>
															No
														</option>
													</Input>
												</Col>
											</Row>
										</FormGroup>
										<Button color="primary">Submit</Button>
									</Form>
								</div>
							)
						case gameStates.CREATED:
							return (
								<div className="host-ui">
									<Button
										color="success"
										size="lg"
										onClick={() =>
											updateGame({
												gamestate: gameStates.STARTED,
												gameID: this.props.game.gameID
											})
										}
									>
										Begin Game
									</Button>
									<div className="qr">
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
									<Button
										color="danger"
										size="lg"
										onClick={() => this.props.toggleModal()}
									>
										Connect Gameboard
									</Button>
									<Modal isOpen={this.props.host.modal}>
										<ModalHeader toggle={this.toggle}>
											Scan a Gameboard QR code.
										</ModalHeader>
										<ModalBody>
											{' '}
											<QrReader
												delay={300}
												onError={this.handleError}
												onScan={this.handleScan}
												style={{
													width: '100%'
												}}
											/>
										</ModalBody>
										<ModalFooter>
											<Button
												color="primary"
												onClick={() => this.props.toggleModal()}
											>
												Close
											</Button>
										</ModalFooter>
									</Modal>
								</div>
							)
						case gameStates.STARTED:
							return (
								<div className="host-ui">
									<Button
										color="success"
										size="lg"
										onClick={() => this.startGame(8000)}
									>
										Start the questions...
									</Button>
								</div>
							)
						case gameStates.QUESTIONS:
							return this.props.host.hostPlay ? (
								<div className="player-ui">
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
												onClick={() => this.sendAnswer('A')}
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
												onClick={() => this.sendAnswer('A')}
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
												onClick={() => this.sendAnswer('B')}
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
												onClick={() => this.sendAnswer('C')}
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
												onClick={() => this.sendAnswer('D')}
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
							) : (
								<div className="host-ui">
									<h3>Question {this.props.game.qNumber}</h3>
									<h5>{he.decode(this.props.game.question)}</h5>
									<br />
									<Button
										color="success"
										size="lg"
										onClick={() => this.nextQuestion()}
									>
										Next Question
									</Button>
								</div>
							)
						case gameStates.ENDED:
							return (
								<div className="host-ui">
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
												<h3
													style={{
														fontSize: '1.75em'
													}}
												>
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
									<Button
										color="danger"
										size="lg"
										style={{
											color: '#212529',
											backgroundColor: 'crimson'
										}}
										onClick={() =>
											this.props.endGame(this.props.game.gameID)
										}
									>
										END GAME
									</Button>
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
		host: state.host,
		user: state.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createGame: game => dispatch(hostCreateGame(game)),
		endGame: gameID => dispatch(gameEnd(gameID)),
		joinGame: gameID => dispatch(gameJoin(gameID)),
		updateAnswer: answer => dispatch(gameUpdateAnswer(answer)),
		updateGameState: gamestate => dispatch(gameStateUpdate(gamestate)),
		updateScore: score => dispatch(userSetScore(score)),
		showAnswer: () => dispatch(gameShowAnswer()),
		toggleModal: () => dispatch(hostToggleModal())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Host)
