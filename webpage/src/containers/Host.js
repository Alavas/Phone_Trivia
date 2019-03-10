import QrReader from 'react-qr-reader'
import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import {
	Button,
	Col,
	Row,
	Form,
	FormGroup,
	Label,
	Input,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap'
import {
	getCookie,
	updateCookie,
	generateUUID,
	loginUser,
	gameCategories,
	gameDifficulties,
	questionType,
	createGame,
	updateGame,
	deleteGame,
	connectGameboard,
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
			modal: false,
			userid: '',
			avatar: null,
			gameID: '',
			loggedIn: false,
			gamestate: 0,
			qNumber: 0,
			players: 0,
			questionID: '',
			answertype: '',
			numQuestions: 10,
			category: 'any_category',
			difficulty: 'easy',
			type: 'any_type'
		}
		this.submit = this.submit.bind(this)
		this.updateGame = this.updateGame.bind(this)
		this.amount = React.createRef()
		this.category = React.createRef()
		this.difficulty = React.createRef()
		this.type = React.createRef()
		this.toggleModal = this.toggleModal.bind(this)
		this.handleScan = this.handleScan.bind(this)
	}

	static getInitialProps({ query }) {
		return { game: query }
	}

	componentDidMount() {
		let userid = getCookie('gs_userid')
		if (userid === '' || userid === 'undefined') {
			userid = generateUUID(window.navigator.userAgent)
		}
		this.userLogin(userid)
	}

	async submit(e) {
		e.preventDefault()
		const gameSettings = {
			amount: this.amount.current.value,
			category: this.category.current.value,
			difficulty: this.difficulty.current.value,
			type: this.type.current.value,
			host: this.state.userid
		}
		const gameID = await createGame(gameSettings)
		this.setState({
			gameID,
			numQuestions: parseInt(gameSettings.amount),
			difficulty: gameSettings.difficulty,
			category: gameSettings.type,
			gamestate: gameStates.CREATED
		})
	}

	async convertedImg(avatar) {
		await updateUser({
			userID: this.state.userid,
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
				'https://picsum.photos/250/?random',
				this.convertedImg.bind(this)
			)
		}
		this.setState({ ...userDetails, loggedIn: true })
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

	toggleModal() {
		this.setState(prevState => ({
			modal: !prevState.modal
		}))
	}

	render() {
		return (
			<div className="host-container">
				<Nav avatar={this.state.avatar} />
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
											<Label>Difficulty</Label>
											<Input
												type="select"
												innerRef={this.difficulty}
											>
												{gameDifficulties.map((choice, index) => {
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
										onClick={() => this.nextQuestion()}
									>
										Start the questions...
									</Button>
								</div>
							)
						case gameStates.QUESTIONS:
							return (
								<div className="host-ui">
									<Button
										color="success"
										size="lg"
										onClick={() => this.nextQuestion()}
									>
										Next Question
									</Button>
									<p className="info">
										<h4>{this.state.qNumber}</h4>
									</p>
									<p className="info">
										<h4>{this.state.questionID}</h4>
									</p>
									<p className="info">
										<h4>{this.state.answertype}</h4>
									</p>
								</div>
							)
						case gameStates.ENDED:
							return (
								<div className="host-ui">
									<p className="info">
										<h1>GAME OVER</h1>
									</p>
									<Button
										color="danger"
										size="lg"
										onClick={() => this.endGame()}
									>
										EXIT GAME
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
