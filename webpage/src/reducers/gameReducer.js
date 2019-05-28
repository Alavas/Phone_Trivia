import { gameStates } from '../utilities'
import _ from 'lodash'

export default (
	state = {
		answer: null,
		answers: [],
		answertype: '',
		correctAnswer: null,
		gameID: null,
		gamestate: null,
		joined: false,
		players: [],
		qNumber: 0,
		qStart: 0,
		question: '',
		questionID: '',
		reaction: 0,
		scores: [],
		showAnswer: false
	},
	action
) => {
	switch (action.type) {
		case 'GAME_UPDATE_ID':
			state = { ...state, gameID: action.gameID }
			break
		case 'GAME_UPDATE_STATE':
			state = { ...state, gamestate: action.gamestate }
			break
		case 'GAME_UPDATE_ANSWER':
			state = { ...state, answer: action.answer }
			break
		case 'GAME_JOIN_SUCCESS':
			state = {
				...state,
				joined: true,
				gameID: action.gameID,
				gamestate: gameStates.CREATED
			}
			break
		case 'GAME_WS_UPDATE':
			state = { ...state, ...action.data }
			break
		case 'GAME_WS_SCORES':
			//Combine old and new scores, keep distinct only.
			const scores = _.uniqBy([...action.scores, ...state.scores], 'userid')
			state = { ...state, scores }
			break
		case 'GAME_WS_PLAYERS':
			state = { ...state, players: action.players }
			break
		case 'GAME_WS_SHOW_ANSWER':
			state = { ...state, showAnswer: action.showAnswer }
			break
		default:
			break
	}
	return state
}
