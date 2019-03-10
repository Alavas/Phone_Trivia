import React, { Component } from 'react'
import Websocket from 'react-websocket'
import QRCode from 'qrcode.react'
import he from 'he'
import _ from 'lodash'
import { Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap'
import Nav from '../components/Nav'
import {
	getCookie,
	updateCookie,
	generateUUID,
	loginUser,
	gameStates
} from '../utilities'
import '../styles/game.css'
import A from '../images/A.png'
import B from '../images/B.png'
import C from '../images/C.png'
import D from '../images/D.png'

class Game extends Component {
	constructor() {
		super()
		this.state = {
			userID: '',
			avatar: null,
			gameID: '',
			gamestate: gameStates.NOTSTARTED,
			question: '',
			answertype: '',
			answers: [],
			players: [],
			scores: []
		}
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

	async userLogin(userID) {
		const userDetails = await loginUser(userID)
		updateCookie(userDetails.userid)
		this.setState({
			userID: userDetails.userid
		})
	}

	//TODO: Validate data coming in here.
	handleData(data) {
		data = JSON.parse(data)
		this.setState({ ...data })
	}

	render() {
		if (this.state.gamestate === gameStates.RESET) {
			this.setState({
				gameID: '',
				gamestate: gameStates.NOTSTARTED,
				question: '',
				answertype: '',
				answers: [],
				players: [],
				scores: []
			})
		}
		return (
			<div>
				<Nav avatar={this.state.avatar} />
				{this.state.userID !== '' ? (
					<Websocket
						url={process.env.REACT_APP_GAMESHOW_WEBSOCKET}
						protocol={`${this.state.userID}`}
						onMessage={this.handleData.bind(this)}
						reconnect={true}
					/>
				) : null}
				{(() => {
					switch (this.state.gamestate) {
						case gameStates.NOTSTARTED:
							return (
								<div className="qr-container">
									<div className="qr">
										<Card
											style={{
												backgroundColor: '#212529',
												border: '0px'
											}}
										>
											<QRCode
												value={`${this.state.userID}`}
												size={400}
												bgColor={'#ffffff'}
												fgColor={'#000000'}
												level={'L'}
												includeMargin={true}
												renderAs={'svg'}
											/>
											<CardBody>
												<CardTitle>
													<h1 className="text-white display-5 fluid">
														HOST SCAN HERE
													</h1>
												</CardTitle>
											</CardBody>
										</Card>
									</div>
								</div>
							)
						case gameStates.CREATED:
							return (
								<div className="qr-container">
									<div className="qr">
										<Card
											style={{
												backgroundColor: '#212529',
												border: '0px'
											}}
										>
											<QRCode
												value={`${
													process.env.REACT_APP_GAMESHOW_ENDPOINT
												}/player/${this.state.gameID}`}
												size={400}
												bgColor={'#ffffff'}
												fgColor={'#000000'}
												level={'L'}
												includeMargin={true}
												renderAs={'svg'}
											/>
											<CardBody>
												<CardTitle>
													<h1 className="text-white display-5 fluid">
														SCAN TO JOIN
													</h1>
												</CardTitle>
											</CardBody>
										</Card>
									</div>
								</div>
							)
						case gameStates.STARTED:
							return (
								<div className="waiting-container">
									<div className="waiting">
										<h1 className="display-1">GET READY...</h1>
									</div>
								</div>
							)
						case gameStates.QUESTIONS:
							return (
								<div className="questions-container">
									<div className="phonetrivia">Phone Trivia</div>
									<div className="question">
										<h1 className="display-3 fluid">
											{he.decode(this.state.question)}
										</h1>
									</div>
									{this.state.answertype === 'multiple' ? (
										<React.Fragment>
											<div className="answer1 border border-white rounded">
												<img
													alt="Answer A"
													src={A}
													className="a-letter"
												/>
												<h1 className="display-4">
													{he.decode(this.state.answers[0])}
												</h1>
											</div>
											<div className="answer2 border border-white rounded">
												<img
													alt="Answer B"
													src={B}
													className="a-letter"
												/>
												<h1 className="display-4">
													{he.decode(this.state.answers[1])}
												</h1>
											</div>
											<div className="answer3 border border-white rounded">
												<img
													alt="Answer C"
													src={C}
													className="a-letter"
												/>
												<h1 className="display-4">
													{he.decode(this.state.answers[2])}
												</h1>
											</div>
											<div className="answer4 border border-white rounded">
												<img
													alt="Answer D"
													src={D}
													className="a-letter"
												/>
												<h1 className="display-4">
													{he.decode(this.state.answers[3])}
												</h1>
											</div>
										</React.Fragment>
									) : (
										<React.Fragment>
											<div className="boolean-true">
												<h1>TRUE</h1>
											</div>
											<div className="boolean-false">
												<h1>FALSE</h1>
											</div>
										</React.Fragment>
									)}
									<div className="scores">
										<h1
											className="display-4 text-white"
											style={{ textAlign: 'center' }}
										>
											Scores
										</h1>
										<ListGroup>
											{this.state.scores.map((player, index) => {
												return (
													<ListGroupItem key={index}>
														<img
															alt={indexedDB}
															src={
																_.find(
																	this.state.players,
																	x => {
																		return (
																			x.userid ===
																			player.userid
																		)
																	}
																).avatar
															}
															className="avatar"
														/>
														<h1 className="display-5 score">
															{player.totalscore}
														</h1>
													</ListGroupItem>
												)
											})}
										</ListGroup>
									</div>
								</div>
							)
						case gameStates.ENDED:
							return (
								<div className="winners-container">
									{_.isUndefined(this.state.scores[0]) ? null : (
										<div className="first-place">
											<h1
												className="display-1"
												style={{ marginTop: '25px' }}
											>
												1st Place:
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
													className="avatar-first"
												/>
												{this.state.scores[0].totalscore}
											</h1>
										</div>
									)}
									{_.isUndefined(this.state.scores[1]) ? null : (
										<div className="second-place">
											<p
												className="display-3 align-middle"
												style={{ marginTop: '30px' }}
											>
												2nd Place:
												<img
													alt="second-place"
													src={
														_.find(this.state.players, x => {
															return (
																x.userid ===
																this.state.scores[1].userid
															)
														}).avatar
													}
													className="avatar-secondthird"
												/>
												{this.state.scores[1].totalscore}
											</p>
										</div>
									)}
									{_.isUndefined(this.state.scores[2]) ? null : (
										<div className="third-place">
											<p
												className="display-3"
												style={{ marginTop: '30px' }}
											>
												3rd Place:
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
													className="avatar-secondthird"
												/>
												{this.state.scores[2].totalscore}
											</p>
										</div>
									)}
								</div>
							)
						default:
							break
					}
				})()}
			</div>
		)
	}
}

export default Game
