import { switchMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { gameJoin } from '../actions/gameActions'
import { hostCreateGameError } from '../actions/hostActions'

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
						'Content-Type': 'application/json'
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
