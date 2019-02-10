import React, { Component } from 'react'
import QRCode from 'qrcode.react'
import {
	getCookie,
	updateCookie,
	generateUUID,
	loginUser,
	gameCategories,
	gameDifficulties,
	questionType,
	createGame,
	updateGame
} from '../utilities'
import Head from '../components/head'
import Nav from '../components/nav'

/*
0: Not Started
1: Created
2: Started
3: Questions
4: Ended
*/

class Host extends Component {
	constructor() {
		super()
		this.state = {
			userid: '',
			gameID: '',
			loggedIn: false,
			hostState: 0,
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
		this.amount = React.createRef()
		this.category = React.createRef()
		this.difficulty = React.createRef()
		this.type = React.createRef()
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
			numQuestions: gameSettings.amount,
			difficulty: gameSettings.difficulty,
			category: gameSettings.type,
			hostState: 1
		})
	}

	async userLogin(userID) {
		const userDetails = await loginUser(userID)
		updateCookie(userDetails.userid)
		this.setState({ ...userDetails, loggedIn: true })
	}

	nextQuestion() {
		const nextQ = this.state.qNumber + 1
		if (nextQ > this.state.numQuestions) {
			console.log('Too many questions!')
		} else {
			this.setState({ qNumber: nextQ }, () => this.updateGame(3))
		}
	}

	async updateGame(state) {
		const gameID = this.state.gameID
		const qNumber = this.state.qNumber
		const game = await updateGame({ state, gameID, qNumber })
		this.setState({
			hostState: game.gamestate,
			qNumber: game.qNumber,
			questionID: game.questionID,
			answertype: game.answertype
		})
	}

	render() {
		return (
			<div>
				<Head title="Gameshow" />
				<Nav />
				{(() => {
					switch (this.state.hostState) {
						case 0:
							return (
								<div className="row">
									<h3>SELECT GAME OPTIONS</h3>
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
						case 1:
							return (
								<div className="row">
									<a
										className="card"
										onClick={() => this.updateGame(2)}
									>
										<h3>BEGIN GAME</h3>
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
									<a className="card">
										<h3>ABANDON GAME</h3>
									</a>
								</div>
							)
						case 2:
							return (
								<div className="row">
									<a
										className="card"
										onClick={() => this.nextQuestion()}
									>
										<h3>Start the questions...</h3>
									</a>
									<a className="card">
										There are {this.state.players} players waiting.
									</a>
								</div>
							)
						case 3:
							return (
								<div className="row">
									<a
										className="card"
										onClick={() => this.nextQuestion()}
									>
										<h3>Next Question</h3>
									</a>
									<a className="card">
										<h4>{this.state.qNumber}</h4>
									</a>
									<a className="card">
										<h4>{this.state.questionID}</h4>
									</a>
									<a className="card">
										<h4>{this.state.answertype}</h4>
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
