import {
	withLatestFrom,
	map,
	catchError,
	switchMap,
	ignoreElements,
	filter
} from 'rxjs/operators'
import { webSocket } from 'rxjs/webSocket'
import { ofType } from 'redux-observable'
import { joinGame, gameStates, submitAnswer } from '../utilities'
import {
	gameJoinSuccess,
	gameJoinError,
	gameUpdateAnswer,
	gameSubmitAnswerError
} from '../actions/gameActions'
import { appReset } from '../actions/appActions'

var socket$ //Placeholder for websocket stream.

//Join a game.
export const gameJoinEpic = (action$, state$) =>
	action$.pipe(
		ofType('GAME_JOIN'),
		withLatestFrom(state$),
		map(state$ => ({ gameID: state$[0].gameID, user: state$[1].user })),
		switchMap(async data => {
			const userID = data.user.userID
			const gameID = data.gameID
			const joined = await joinGame({ userID, gameID })
			if (joined) {
				return gameJoinSuccess(gameID)
			} else {
				return gameJoinError('Unable to join the game.')
			}
		}),
		catchError(err => gameJoinError(err))
	)

//Delete the game after it has been finished.
export const gameEndEpic = action$ =>
	action$.pipe(
		ofType('GAME_END'),
		map(async action => {
			let data = JSON.stringify({ gameID: action.gameID })
			await fetch(`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json, text/plain, */*',
					'Content-Type': 'application/json'
				},
				body: data
			})
		}),
		ignoreElements()
	)

//Send answer to the question.
export const gameSubmitAnswerEpic = (action$, state$) =>
	action$.pipe(
		ofType('GAME_SUBMIT_ANSWER'),
		withLatestFrom(state$),
		map(state$ => ({
			answer: state$[0].answer,
			game: state$[1].game,
			user: state$[1].user
		})),
		switchMap(async state => {
			let reaction = Date.now() - state.game.qStart
			reaction = Math.max(reaction, 1000)
			let score = Math.round(25 * (10000 / (reaction - 500)))
			score = Math.min(Math.max(score, 0), 250)
			const submission = {
				gameID: state.game.gameID,
				questionID: state.game.questionID,
				userID: state.user.userID,
				answer: state.answer,
				reaction,
				score
			}
			document.getElementById('countdown-bar').stop()
			const result = await submitAnswer(submission)
			if (result) {
				return gameUpdateAnswer(state.answer)
			} else {
				return gameSubmitAnswerError('Unable to send answer.')
			}
		})
	)

//Create a Websocket connection to the server once the game is joined.
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
					msg.type === 'WS_PLAYERS' ||
					msg.type === 'WS_SHOW_ANSWER'
			)
		}),
		map(msg => ({ type: msg.type, data: msg.data }))
	)

//Websocket message to server for showing game answer, rebroadcast to all players.
export const gameShowAnswerEpic = (action$, state$) =>
	action$.pipe(
		ofType('GAME_SHOW_ANSWER'),
		withLatestFrom(state$),
		map(([, state]) => state),
		filter(state => state.game.gamestate === gameStates.QUESTIONS),
		map(state => {
			const wsData = {
				type: 'SHOW_ANSWER',
				gameID: state.game.gameID
			}
			socket$._socket.send(JSON.stringify(wsData))
		}),
		ignoreElements()
	)

//Receive general Websocket messages for the game. State/Questions/etc...
export const gameWSGameEpic = action$ =>
	action$.pipe(
		ofType('WS_GAME'),
		map(action => {
			if (document.getElementById('countdown-bar')) {
				document.getElementById('countdown-bar').reset()
				document.getElementById('countdown-bar').start()
			}
			if (action.data.gamestate === gameStates.RESET) {
				return appReset()
			}
			return {
				type: 'GAME_WS_UPDATE',
				data: {
					...action.data,
					answer: null,
					showAnswer: false,
					qStart: Date.now()
				}
			}
		})
	)

//Receive Websocket message of game scores.
export const gameWSScoresEpic = action$ =>
	action$.pipe(
		ofType('WS_SCORES'),
		map(action => ({ type: 'GAME_WS_SCORES', scores: action.data }))
	)

//Receive Websocket message containing all players for the gmae.
export const gameWSPlayersEpic = action$ =>
	action$.pipe(
		ofType('WS_PLAYERS'),
		map(action => ({ type: 'GAME_WS_PLAYERS', players: action.data }))
	)

//Receive Websocket message to show the answer to the current question.
export const gameWSShowAnswerEpic = action$ =>
	action$.pipe(
		ofType('WS_SHOW_ANSWER'),
		map(action => ({ type: 'GAME_WS_SHOW_ANSWER', showAnswer: action.data }))
	)
