if (typeof window != 'undefined') {
	var QrReader = require('react-qr-reader')
}
import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
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
	gameStates
} from '../utilities'
import Head from '../components/head'
import Nav from '../components/nav'

class Host extends Component {
	constructor() {
		super()
		this.state = {
			modal: false,
			userid: '',
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

	async userLogin(userID) {
		const userDetails = await loginUser(userID)
		updateCookie(userDetails.userid)
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
			window.location = process.env.GAMESHOW_ENDPOINT
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
			<div>
				<Head title="Gameshow" />
				{this.state.gamestate !== gameStates.ENDED ? <Nav /> : null}
				{(() => {
					switch (this.state.gamestate) {
						case gameStates.NOTSTARTED:
							return (
								<div className="row" style={{ width: '200px' }}>
									<h4>Select Game Options</h4>
									<form onSubmit={this.submit}>
										<h5>How many questions?</h5>
										<input
											type="number"
											name="amount"
											min="10"
											max="50"
											defaultValue="10"
											ref={this.amount}
										/>
										<h5>Category?</h5>
										<select name="category" ref={this.category}>
											{gameCategories.map((choice, index) => {
												return (
													<option key={index} value={choice.value}>
														{choice.display}
													</option>
												)
											})}
										</select>
										<h5>How difficult?</h5>
										<select ref={this.difficulty}>
											{gameDifficulties.map((choice, index) => {
												return (
													<option key={index} value={choice.value}>
														{choice.display}
													</option>
												)
											})}
										</select>
										<h5>Question type?</h5>
										<select ref={this.type}>
											{questionType.map((choice, index) => {
												return (
													<option key={index} value={choice.value}>
														{choice.display}
													</option>
												)
											})}
										</select>
										<br />
										<br />
										<input type="submit" />
									</form>
								</div>
							)
						case gameStates.CREATED:
							return (
								<div className="row">
									<a
										className="card"
										onClick={() =>
											this.updateGame(gameStates.STARTED)
										}
									>
										<h4>Begin Game</h4>
									</a>
									<div className="qr">
										<QRCode
											value={`${
												process.env.GAMESHOW_ENDPOINT
											}/player/${this.state.gameID}`}
											size={225}
											bgColor={'#ffffff'}
											fgColor={'#000000'}
											level={'L'}
											includeMargin={false}
											renderAs={'svg'}
										/>
									</div>
									<a
										className="card"
										onClick={() => this.toggleModal()}
									>
										<h4>Connect Gameboard</h4>
									</a>
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
												style={{ width: '100%' }}
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
								<div className="row">
									<a
										className="card"
										onClick={() => this.nextQuestion()}
									>
										<h3>Start the questions...</h3>
									</a>
									<a className="info">
										There are {this.state.players} players waiting.
									</a>
								</div>
							)
						case gameStates.QUESTIONS:
							return (
								<div className="row">
									<a
										className="card"
										onClick={() => this.nextQuestion()}
									>
										<h3>Next Question</h3>
									</a>
									<a className="info">
										<h4>{this.state.qNumber}</h4>
									</a>
									<a className="info">
										<h4>{this.state.questionID}</h4>
									</a>
									<a className="info">
										<h4>{this.state.answertype}</h4>
									</a>
								</div>
							)
						case gameStates.ENDED:
							return (
								<div className="row">
									<a className="info">
										<h1>GAME OVER</h1>
									</a>
									<a className="card" onClick={() => this.endGame()}>
										<h3>EXIT GAME</h3>
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
						height: 100vh;
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
					.info {
						padding: 18px 18px 24px;
						margin-bottom: 25px;
						text-decoration: none;
						text-align: center;
						color: #067df7;
					}
					.card {
						padding: 18px 18px 24px;
						margin-bottom: 25px;
						text-decoration: none;
						text-align: center;
						color: #067df7;
						border: 1px solid #9b9b9b;
					}
					.qr {
						margin-bottom: 25px;
						text-align: center;
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

export default Host
