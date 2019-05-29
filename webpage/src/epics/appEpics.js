import { map, ignoreElements } from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { push } from 'connected-react-router'
import { appError } from '../actions/appActions'

//Once the game state has been reset return to the root path.
export const appResetEpic = action$ =>
	action$.pipe(
		ofType('APP_RESET'),
		map(() => {
			const toast = document.getElementById('error-toast')
			toast.className = 'hide'
			return push('/')
		})
	)

export const appErrorEpic = action$ =>
	action$.pipe(
		ofType(
			'GAME_JOIN_ERROR',
			'GAME_SUBMIT_ANSWER_ERROR',
			'HOST_CREATE_GAME_ERROR',
			'USER_LOGIN_ERROR'
		),
		map(action => {
			return appError(action.error)
		})
	)

export const appDisplayErrorEpic = action$ =>
	action$.pipe(
		ofType('APP_ERROR'),
		map(() => {
			const toast = document.getElementById('error-toast')
			toast.className = 'show'
		}),
		ignoreElements()
	)
