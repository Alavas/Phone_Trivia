import React, { Component } from 'react'
import { connect } from 'react-redux'
import QrReader from 'react-qr-reader'
import QRCode from 'qrcode.react'
import Websocket from 'react-websocket'
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
	joinGame,
	createGame,
	updateGame,
	deleteGame,
	connectGameboard,
	submitAnswer,
	gameStates
} from '../utilities'
import { userSetScore } from '../actions/userActions'
import '../components/CountdownBar'
import '../styles/host.css'

class Host extends Component {
	constructor(props) {
		super(props)
		this.state = {
			answer: null,
			answers: [
				'First Answer',
				'Second Answer',
				'Third Answer',
				'Fourth Answer'
			],
			answertype: '',
			category: 'any_category',
			correctAnswer: null,
			difficulty: 'easy',
			gameID: '',
			gamestate: 0,
			hostPlay: true,
			joined: false,
			modal: false,
			numQuestions: 10,
			players: [],
			qNumber: 0,
			qStart: 0,
			question: 'This is a test question?',
			questionID: '',
			reaction: 0,
			score: 0,
			scores: [],
			showAnswer: false,
			type: 'any_type'
		}
		this.submit = this.submit.bind(this)
		this.updateGame = this.updateGame.bind(this)
		this.amount = React.createRef()
		this.category = React.createRef()
		this.difficulty = React.createRef()
		this.type = React.createRef()
		this.hostPlay = React.createRef()
		this.toggleModal = this.toggleModal.bind(this)
		this.handleScan = this.handleScan.bind(this)
	}

	async submit(e) {
		e.preventDefault()
		const gameSettings = {
			amount: this.amount.current.value,
			category: this.category.current.value,
			difficulty: this.difficulty.current.value,
			type: this.type.current.value,
			host: this.props.user.userID
		}
		const userID = this.props.user.userID
		const gameID = await createGame(gameSettings)
		const joined = await joinGame({ userID, gameID })
		const hostPlay = this.hostPlay.current.value === 'true'
		this.setState({
			gameID,
			joined,
			numQuestions: parseInt(gameSettings.amount),
			difficulty: gameSettings.difficulty,
			category: gameSettings.type,
			gamestate: gameStates.CREATED,
			hostPlay
		})
	}

	async nextQuestion() {
		const nextQ = this.state.qNumber + 1
		if (nextQ > this.state.numQuestions) {
			this.updateGame(gameStates.ENDED)
		} else {
			this.setState({ qNumber: nextQ }, () =>
				this.updateGame(gameStates.QUESTIONS)
			)
		}
	}

	async startGame(delay) {
		if (this.state.hostPlay) {
			do {
				await this.nextQuestion()
				await new Promise(resolve => setTimeout(resolve, delay))
				const wsTest = {
					action: 'SHOW_ANSWER',
					data: { gameID: this.state.gameID }
				}
				this.wsRef.sendMessage(JSON.stringify(wsTest))
				await new Promise(resolve => setTimeout(resolve, 1500))
			} while (this.state.qNumber < this.state.numQuestions)
			await this.nextQuestion()
		} else {
			this.nextQuestion()
		}
	}

	async updateGame(state) {
		const gameID = this.state.gameID
		const qNumber = this.state.qNumber
		const game = await updateGame({ state, gameID, qNumber })
		this.setState({
			gamestate: game.gamestate,
			qNumber: game.qNumber,
			questionID: game.questionID,
			answertype: game.answertype
		})
	}

	async endGame() {
		const gameID = this.state.gameID
		const deleted = await deleteGame(gameID)
		if (deleted) {
			window.location = process.env.REACT_APP_GAMESHOW_ENDPOINT
		} else {
			//TODO: Add error handling here for a failed deletion.
			console.log('Something went wrong??')
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

	handleScan(data) {
		const regex = RegExp(
			'[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}'
		)
		if (data) {
			//Regex to confirm that the link is valid.
			if (regex.test(data)) {
				const gameID = this.state.gameID
				connectGameboard({ userID: data, gameID })
				this.setState({ modal: false })
			}
		}
	}

	handleError(err) {
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

	toggleModal() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}))
	}

	render() {
		return (
			<div className="host-container">
				{this.state.joined ? (
					<Websocket
						url={process.env.REACT_APP_GAMESHOW_WEBSOCKET}
						protocol={this.state.gameID}
						onMessage={this.handleData.bind(this)}
						ref={Websocket => {
							this.wsRef = Websocket
						}}
					/>
				) : null}
				{(() => {
					switch (this.state.gamestate) {
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
											this.updateGame(gameStates.STARTED)
										}
									>
										Begin Game
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
									<Button
										color="danger"
										size="lg"
										onClick={() => this.toggleModal()}
									>
										Connect Gameboard
									</Button>
									<Modal
										isOpen={this.state.modal}
										toggle={this.toggleModal}
									>
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
												onClick={this.toggleModal}
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
							return this.state.hostPlay ? (
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
							) : (
								<div className="host-ui">
									<h3>Question {this.state.qNumber}</h3>
									<h5>{he.decode(this.state.question)}</h5>
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
												<h3
													style={{
														fontSize: '1.75em'
													}}
												>
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
									<Button
										color="danger"
										size="lg"
										style={{
											color: '#212529',
											backgroundColor: 'crimson'
										}}
										onClick={() => this.endGame()}
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
)(Host)
