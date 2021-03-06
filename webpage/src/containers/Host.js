import React, { Component } from 'react'
import { connect } from 'react-redux'
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
	Row
} from 'reactstrap'
import {
	gameCategories,
	gameDifficulties,
	questionType,
	updateGame,
	gameStates
} from '../utilities'
import '../components/CountdownBar'
import '../styles/host.css'
import {
	gameJoin,
	gameStateUpdate,
	gameShowAnswer,
	gameEnd,
	gameSubmitAnswer
} from '../actions/gameActions'
import { hostCreateGame, hostQuestion } from '../actions/hostActions'
import InviteButton from '../components/InviteButton'
import CountdownTimer from '../components/CountdownTimer'

class Host extends Component {
	constructor(props) {
		super(props)
		this.submit = this.submit.bind(this)
		this.amount = React.createRef()
		this.category = React.createRef()
		this.difficulty = React.createRef()
		this.type = React.createRef()
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
			token: this.props.user.token
		}
		this.props.createGame(gameSettings)
	}

	render() {
		return (
			<div className="host-container">
				{(() => {
					switch (this.props.game.gamestate) {
						case gameStates.NOTSTARTED:
							return (
								<div className="host-ui-flex">
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
												<Col xs={12}>
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
											</Row>
										</FormGroup>
										<Button color="primary">Submit</Button>
									</Form>
								</div>
							)
						case gameStates.CREATED:
							return (
								<div className="host-ui-grid">
									<Button
										color="success"
										size="lg"
										style={{ gridArea: '2/2/3/3' }}
										onClick={() =>
											updateGame({
												gamestate: gameStates.STARTED,
												gameID: this.props.game.gameID,
												token: this.props.user.token
											})
										}
									>
										Begin Game
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
								<div className="host-ui-flex">
									<CountdownTimer
										players={this.props.game.players.length}
										host={true}
										nextState={this.props.startQuestions}
									/>
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
										delay={1000}
									/>
								</div>
							)
						case gameStates.ENDED:
							return (
								<div className="host-ui-flex">
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
		updateGameState: gamestate => dispatch(gameStateUpdate(gamestate)),
		showAnswer: () => dispatch(gameShowAnswer()),
		startQuestions: delay => dispatch(hostQuestion(delay)),
		submitAnswer: answer => dispatch(gameSubmitAnswer(answer))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Host)
