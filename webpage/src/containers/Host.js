import QrReader from 'react-qr-reader'
import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import Websocket from 'react-websocket'
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
import he from 'he'
import _ from 'lodash'
import {
	getCookie,
	updateCookie,
	generateUUID,
	loginUser,
	gameCategories,
	gameDifficulties,
	questionType,
	joinGame,
	createGame,
	updateGame,
	deleteGame,
	connectGameboard,
	submitAnswer,
	gameStates,
	updateUser,
	convertImage
} from '../utilities'
import Nav from '../components/Nav'
import '../styles/host.css'

class Host extends Component {
	constructor() {
		super()
		this.state = {
			answer: null,
			answers: [],
			answertype: '',
			avatar: null,
			category: 'any_category',
			difficulty: 'easy',
			gamestate: 0,
			hostPlay: false,
			joined: false,
			gameID: null,
			loggedIn: false,
			modal: false,
			numQuestions: 10,
			players: [],
			qNumber: 0,
			qStart: 0,
			questionID: '',
			question: '',
			reaction: 0,
			result: 'No Result',
			score: 0,
			scores: [],
			type: 'any_type',
			userID: '',
			validGame: false
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

	static getInitialProps({ query }) {
		return { game: query }
	}

	componentDidMount() {
		let userID = getCookie('gs_userid')
		if (userID === '' || userID === 'undefined') {
			userID = generateUUID(window.navigator.userAgent)
		}
		this.userLogin(userID)
	}

	async submit(e) {
		e.preventDefault()
		const gameSettings = {
			amount: this.amount.current.value,
			category: this.category.current.value,
			difficulty: this.difficulty.current.value,
			type: this.type.current.value,
			host: this.state.userID
		}
		const userID = this.state.userID
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

	async convertedImg(avatar) {
		await updateUser({
			userID: this.state.userID,
			avatar
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
			avatar: userDetails.avatar,
			loggedIn: true
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

	async startGame(delay) {
		if (this.state.hostPlay) {
			do {
				await this.nextQuestion()
				await new Promise(resolve => setTimeout(resolve, delay))
			} while (this.state.qNumber < this.state.numQuestions)
			await this.nextQuestion()
		} else {
			this.nextQuestion()
		}
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
			userID: this.state.userID,
			answer,
			reaction,
			score
		}
		const result = await submitAnswer(submission)
		if (result) {
			this.setState({ answer, score, reaction })
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
			this.setState({ ...data, answer: null })
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
			<div className="host-container">
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

export default Host
