import {
	mergeMap,
	withLatestFrom,
	map,
	catchError,
	switchMap
} from 'rxjs/operators'
import { webSocket } from 'rxjs/webSocket'
import { ofType } from 'redux-observable'
import { joinGame, gameStates } from '../utilities'
import { gameJoinSuccess, gameJoinError } from '../actions/gameActions'

var socket$ //Placeholder for websocket stream.

export const gameJoinEpic = (action$, state$) =>
	action$.pipe(
		ofType('GAME_JOIN'),
		withLatestFrom(state$),
		map(state$ => ({ gameID: state$[0].gameID, user: state$[1].user })),
		mergeMap(async data => {
			const userID = data.user.userID
			const gameID = data.gameID
			const joined = await joinGame({ userID, gameID })
			if (joined) {
				return gameJoinSuccess(gameID)
			} else {
				return gameJoinError('Sorry, there was an error.')
			}
		}),
		catchError(err => gameJoinError(err))
	)

export const gameWebSocketEpic = (action$, state$) =>
	action$.pipe(
		ofType('GAME_JOIN_SUCCESS'),
		withLatestFrom(state$),
		map(([, state]) => state),
		map(state => {
			socket$ = webSocket({
				url: process.env.REACT_APP_GAMESHOW_WEBSOCKET,
				protocol: state.game.gameID
			})
		}),
		switchMap(() => {
			return socket$.multiplex(
				() => {
					return { type: 'WEBSOCKET_MESSAGE' }
				},
				() => {
					return { type: 'DISCONNECTED' }
				},
				msg =>
					msg.type === 'WS_GAME' ||
					msg.type === 'WS_SCORES' ||
					msg.type === 'WS_PLAYERS'
			)
		}),
		map(msg => ({ type: msg.type, data: msg.data }))
	)

export const gameWSGameEpic = action$ =>
	action$.pipe(
		ofType('WS_GAME'),
		map(action => {
			if (document.getElementById('countdown-bar')) {
				document.getElementById('countdown-bar').reset()
				document.getElementById('countdown-bar').start()
			}
			return {
				type: 'GAME_WS_UPDATE',
				data: { ...action.data, answer: null, showAnswer: false }
			}
		})
	)

export const gameWSScoresEpic = action$ =>
	action$.pipe(
		ofType('WS_SCORES'),
		map(action => ({ type: 'GAME_WS_SCORES', scores: action.data }))
	)

export const gameWSPlayersEpic = action$ =>
	action$.pipe(
		ofType('WS_PLAYERS'),
		map(action => ({ type: 'GAME_WS_PLAYERS', players: action.data }))
	)

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
		case 'GAME_JOIN_SUCCESS':
			state = {
				...state,
				joined: true,
				gameID: action.gameID,
				gamestate: gameStates.CREATED
			}
			break
		case 'GAME_WS_UPDATE':
			const test = { WSTest: 'testing...' }
			socket$._socket.send(JSON.stringify(test))
			state = { ...state, ...action.data }
			break
		case 'GAME_WS_SCORES':
			state = { ...state, scores: action.scores }
			break
		case 'GAME_WS_PLAYERS':
			state = { ...state, players: action.players }
			break
		default:
			break
	}
	return state
}
