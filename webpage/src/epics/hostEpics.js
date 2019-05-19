import { mergeMap } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { gameJoin } from '../actions/gameActions'

//Create a new game, join after it is created.
export const hostCreateGameEpic = action$ =>
	action$.pipe(
		ofType('HOST_CREATE_GAME'),
		mergeMap(async action => {
			let data = JSON.stringify({ gameSettings: action.game })
			const game = await fetch(
				`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`,
				{
					method: 'POST',
					headers: {
						Accept: 'application/json, text/plain, */*',
						'Content-Type': 'application/json'
					},
					body: data
				}
			).then(res => res.json())
			return gameJoin(game.gameid)
		})
	)
