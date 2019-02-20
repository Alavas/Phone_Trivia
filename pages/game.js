import React, { Component } from 'react'
import Websocket from 'react-websocket'
import QRCode from 'qrcode.react'
import he from 'he'
import {
	Alert,
	Card,
	CardBody,
	CardTitle,
	ListGroup,
	ListGroupItem
} from 'reactstrap'
import _ from 'lodash'
import Head from '../components/head'
import Nav from '../components/nav'
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
			gameID: '',
			gamestate: 0,
			question: '',
			answertype: '',
			answers: [],
			players: [
				{ userid: '', avatar: '../static/avatar1.png', score: '950' },
				{ userid: '', avatar: '../static/avatar2.png', score: '830' },
				{ userid: '', avatar: '../static/avatar3.png', score: '604' },
				{ userid: '', avatar: '../static/avatar4.png', score: '582' },
				{ userid: '', avatar: '../static/avatar5.png', score: '310' }
			]
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
			userID: userDetails.userid,
			avatar: userDetails.avatar,
			score: userDetails.score
		})
	}

	//TODO: Validate data coming in here.
	handleData(data) {
		data = JSON.parse(data)

		this.setState({ ...data })
	}

	render() {
		return (
			<div>
				<Head title="Gameshow" />
				<Nav />
				{this.state.userID !== '' ? (
					<Websocket
						url={process.env.GAMESHOW_WEBSOCKET}
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
													process.env.GAMESHOW_ENDPOINT
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
												<h1 className="display-3">
													{he.decode(this.state.answers[0])}
												</h1>
											</div>
											<div className="answer2 border border-white rounded">
												<img
													src="../static/B.png"
													className="a-letter"
												/>
												<h1 className="display-3">
													{he.decode(this.state.answers[1])}
												</h1>
											</div>
											<div className="answer3 border border-white rounded">
												<img
													src="../static/C.png"
													className="a-letter"
												/>
												<h1 className="display-3">
													{he.decode(this.state.answers[2])}
												</h1>
											</div>
											<div className="answer4 border border-white rounded">
												<img
													src="../static/D.png"
													className="a-letter"
												/>
												<h1 className="display-3">
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
											{this.state.players.map((player, index) => {
												return (
													<ListGroupItem key={index}>
														<img
															src={player.avatar}
															className="avatar"
														/>
														<h1 className="display-5 score">
															{player.score}
														</h1>
													</ListGroupItem>
												)
											})}
										</ListGroup>
									</div>
								</div>
							)
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
						margin-top: 10px;
					}
					.answer2 {
						color: white;
						grid-area: 8 / 4 / 9 / 7;
					}
					.answer2 h1 {
						margin-top: 10px;
					}
					.answer3 {
						color: white;
						grid-area: 10 / 4 / 11 / 7;
					}
					.answer3 h1 {
						margin-top: 10px;
					}
					.answer4 {
						color: white;
						grid-area: 12 / 4 / 13 / 7;
					}
					.answer4 h1 {
						margin-top: 10px;
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
