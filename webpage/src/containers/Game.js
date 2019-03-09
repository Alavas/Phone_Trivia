import React, { Component } from 'react'
import Websocket from 'react-websocket'
import QRCode from 'qrcode.react'
import he from 'he'
import _ from 'lodash'
import {
	Alert,
	Card,
	CardBody,
	CardTitle,
	ListGroup,
	ListGroupItem
} from 'reactstrap'
import Nav from '../components/Nav'
import {
	getCookie,
	updateCookie,
	generateUUID,
	loginUser,
	gameStates
} from '../utilities'

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
														To connect to this gameboard the host
														must scan the QR code.
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
														Scan to join the game.
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
										<h1 className="display-1">
											Get ready to start...
										</h1>
									</div>
								</div>
							)
						case gameStates.QUESTIONS:
							return (
								<div className="questions-container">
									<div className="title">
										<i
											style={{ marginTop: '20px' }}
											className="fas fa-mobile-alt text-white float-right"
										/>
										<h1 className="display-1 text-white">
											Phone Trivia
										</h1>
									</div>
									<div className="question">
										<h1 className="display-3 fluid">
											{he.decode(this.state.question)}
										</h1>
									</div>
									{this.state.answertype === 'multiple' ? (
										<React.Fragment>
											<div className="answer1 border border-white rounded">
												<img
													src="../static/A.png"
													className="a-letter"
												/>
												<h1 className="display-4">
													{he.decode(this.state.answers[0])}
												</h1>
											</div>
											<div className="answer2 border border-white rounded">
												<img
													src="../static/B.png"
													className="a-letter"
												/>
												<h1 className="display-4">
													{he.decode(this.state.answers[1])}
												</h1>
											</div>
											<div className="answer3 border border-white rounded">
												<img
													src="../static/C.png"
													className="a-letter"
												/>
												<h1 className="display-4">
													{he.decode(this.state.answers[2])}
												</h1>
											</div>
											<div className="answer4 border border-white rounded">
												<img
													src="../static/D.png"
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
												<Alert
													color="success"
													className="display-3 text-center"
												>
													TRUE
												</Alert>
											</div>
											<div className="boolean-false">
												<Alert
													color="danger"
													className="display-3 text-center"
												>
													FALSE
												</Alert>
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
				<style jsx>{`
					:global(html) {
						width: 100vw;
						height: 100vh;
						font-size: 12px !important;
					}
					:global(body) {
						width: 100vw;
						height: 100vh;
						min-width: 1400px;
					}
					.winners-container {
						font-family: 'Dosis', sans-serif;
						background-color: #212529;
						width: 100vw;
						height: calc(100vh - 65px);
						display: grid;
						grid-template-columns: 1fr 50px 600px 50px 1fr;
						grid-template-rows: 1fr repeat(3, 30px 150px) 1fr;
					}
					.first-place {
						text-align: center;
						background-color: white;
						grid-area: 2 / 2 / 4 / 5;
					}
					.second-place {
						text-align: center;
						background-color: white;
						grid-area: 5 / 3 / 5 / 4;
					}
					.third-place {
						text-align: center;
						background-color: white;
						grid-area: 7 / 3 / 8 / 4;
					}
					.waiting-container {
						font-family: 'Dosis', sans-serif;
						background-color: #212529;
						width: 100vw;
						height: calc(100vh - 65px);
						display: grid;
						grid-template-columns: 1fr 400px 1fr;
						grid-template-rows: 1fr 200px 1fr;
					}
					.waiting {
						text-align: center;
						color: white;
						grid-area: 2 / 2 / 3 / 3;
					}
					.qr-container {
						font-family: 'Dosis', sans-serif;
						background-color: #212529;
						width: 100vw;
						height: calc(100vh - 65px);
						display: grid;
						grid-template-columns: 1fr 400px 1fr;
						grid-template-rows: 1fr 500px 1fr;
					}
					.qr {
						text-align: center;
						grid-area: 2 / 2 / 3 / 3;
					}
					.questions-container {
						font-family: 'Dosis', sans-serif;
						background-color: #212529;
						width: 100vw;
						min-width: 1400px;
						height: calc(100vh - 65px);
						display: grid;
						grid-template-columns: 40px 350px 60px 1fr 200px 450px 40px;
						grid-template-rows: 40px 110px 25px 1fr 25px repeat(
								4,
								90px 25px
							);
					}
					.title {
						text-align: center;
						font-size: 48px;
						grid-area: 2 / 6 / 3 / 7;
						justify-content: center;
						font-style: italic;
					}
					.question {
						grid-area: 4 / 4 / 5 / 7;
						position: relative;
					}
					.question h1 {
						padding: 15px;
						background-color: #212529;
						color: white;
						position: relative;
					}
					.boolean-true {
						width: 200px;
						grid-area: 6 / 5 / 7 / 6;
					}
					.boolean-true h1 {
						margin-top: 10px;
					}
					.boolean-false {
						grid-area: 8 / 5 / 9 / 6;
					}
					.boolean false h1 {
						margin-top: 10px;
					}
					.answer1 {
						color: white;
						grid-area: 6 / 4 / 7 / 7;
					}
					.answer1 h1 {
						margin-top: 15px;
					}
					.answer2 {
						color: white;
						grid-area: 8 / 4 / 9 / 7;
					}
					.answer2 h1 {
						margin-top: 15px;
					}
					.answer3 {
						color: white;
						grid-area: 10 / 4 / 11 / 7;
					}
					.answer3 h1 {
						margin-top: 15px;
					}
					.answer4 {
						color: white;
						grid-area: 12 / 4 / 13 / 7;
					}
					.answer4 h1 {
						margin-top: 15px;
					}
					.scores {
						grid-area: 2 / 2 / 13 / 3;
					}
					.score {
						float: right;
					}
					.avatar {
						vertical-align: middle;
						width: 50px;
						height: 50px;
						border-radius: 50%;
					}
					.avatar-first {
						margin-left: 10px;
						margin-right: 10px;
						margin-bottom: 15px;
						width: 130px;
						height: 130px;
						border-radius: 50%;
					}
					.avatar-secondthird {
						margin-left: 10px;
						margin-right: 10px;
						margin-bottom: 15px;
						width: 80px;
						height: 80px;
						border-radius: 50%;
					}
					.a-letter {
						float: left;
						margin-left: 20px;
						margin-right: 20px;
						margin-top: 20px;
						vertical-align: middle;
						width: 50px;
						height: 50px;
						border-radius: 50%;
					}
				`}</style>
			</div>
		)
	}
}

export default Game