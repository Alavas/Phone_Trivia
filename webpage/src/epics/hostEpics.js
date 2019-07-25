import { switchMap, withLatestFrom, map, delay, filter } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { gameJoin, gameShowAnswer } from '../actions/gameActions'
import { hostCreateGameError, hostQuestion } from '../actions/hostActions'
import { gameStates, updateGame } from '../utilities'

//Create a new game, join after it is created.
export const hostCreateGameEpic = action$ =>
	action$.pipe(
		ofType('HOST_CREATE_GAME'),
		switchMap(async action => {
			let data = JSON.stringify({ gameSettings: action.game })
			let errorMsg = ''
			return await fetch(
				`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`,
				{
					method: 'POST',
					headers: {
						Accept: 'application/json, text/plain, */*',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${action.game.token}`
					},
					body: data
				}
			)
				.then(res => {
					errorMsg = res.statusText
					return res.json()
				})
				.then(
					res => gameJoin(res.gameid),
					error =>
						hostCreateGameError(`Error creating new game: ${errorMsg}`)
				)
		})
	)

//Request the next question.
export const hostQuestionEpic = (action$, state$) =>
	action$.pipe(
		ofType('HOST_QUESTION'),
		withLatestFrom(state$),
		map(state$ => ({
			game: state$[1].game,
			host: state$[1].host,
			user: state$[1].user
		})),
		map(async state => {
			const qNumber = state.game.qNumber + 1
			if (qNumber <= state.host.amount) {
				await updateGame({
					gamestate: gameStates.QUESTIONS,
					gameID: state.game.gameID,
					qNumber,
					token: state.user.token
				})
			} else {
				await updateGame({
					gamestate: gameStates.ENDED,
					gameID: state.game.gameID,
					token: state.user.token
				})
			}
		}),
		delay(8000),
		map(() => gameShowAnswer())
	)

//After the answers are displayed wait and then show the next question.
export const hostNextQuestionEpic = (action$, state$) =>
	action$.pipe(
		ofType('GAME_WS_SHOW_ANSWER'),
		withLatestFrom(state$),
		map(state$ => ({ host: state$[1].host })),
		filter(state => state.host.isHost === true),
		delay(2000),
		map(() => hostQuestion())
	)
