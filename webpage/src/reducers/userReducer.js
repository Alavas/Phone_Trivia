import {
	filter,
	mergeMap,
	catchError,
	map,
	withLatestFrom
} from 'rxjs/operators'
import { ofType } from 'redux-observable'
import _ from 'lodash'
import {
	getDefaultAvatar,
	loginUser,
	updateCookie,
	updateUser
} from '../utilities'
import {
	userLoginSuccess,
	userLoginError,
	userSetAvatar,
	userSetScore
} from '../actions/userActions'

//Login the user to the backend server.
export const userLoginEpic = action$ =>
	action$.pipe(
		ofType('USER_LOGIN'),
		mergeMap(async () => {
			const user = await loginUser()
			return userLoginSuccess(user)
		}),
		catchError(err => userLoginError(err))
	)

//Update the cookie for the user.
export const userUpdateCookieEpic = action$ =>
	action$.pipe(
		ofType('USER_LOGIN_SUCCESS'),
		mergeMap(async action => {
			await updateCookie(action.user.userid)
			return { type: 'USER_UPDATE_COOKIE' }
		})
	)

//Once the user is logged in check to see if they have an Avatar.
export const userDefaultAvatarEpic = (action$, state$) =>
	action$.pipe(
		ofType('USER_LOGIN_SUCCESS'),
		filter(() => state$.value.user),
		filter(state => state.user.avatar === '' || state.user.avatar === null),
		mergeMap(async state => {
			const avatar = await getDefaultAvatar(
				'https://picsum.photos/100/?random'
			)
			await updateUser({ userID: state.user.userid, avatar })
			return userSetAvatar(avatar)
		}),
		catchError(err => userLoginError(err))
	)

//Socket is not connected until the game has been joined. Update individual user score when scores object received.
export const userWSScoreEpic = (action$, state$) =>
	action$.pipe(
		ofType('WS_SCORES'),
		withLatestFrom(state$),
		map(state$ => ({ scores: state$[0].data, state: state$[1] })),
		map(data => {
			let currentScore = _.find(data.scores, score => {
				return score.userid === data.state.user.userID
			})
			if (!_.isUndefined(currentScore)) {
				currentScore = currentScore.totalscore
			} else {
				currentScore = data.state.user.score
			}
			return currentScore
		}),
		map(score => userSetScore(score))
	)

export default (
	state = {
		avatar: null,
		loggedIn: false,
		score: 0,
		userID: ''
	},
	action
) => {
	switch (action.type) {
		case 'USER_LOGIN_SUCCESS':
			state = {
				...state,
				userID: action.user.userid,
				avatar: action.user.avatar,
				loggedIn: true
			}
			break
		case 'USER_SET_AVATAR':
			state = { ...state, avatar: action.avatar }
			break
		case 'USER_SET_SCORE':
			state = { ...state, score: action.score }
			break
		default:
			break
	}
	return state
}
