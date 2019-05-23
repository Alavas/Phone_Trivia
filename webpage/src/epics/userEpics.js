import {
	filter,
	mergeMap,
	catchError,
	map,
	withLatestFrom,
	ignoreElements,
	switchMap
} from 'rxjs/operators'
import { ofType } from 'redux-observable'
import _ from 'lodash'
import {
	getDefaultAvatar,
	updateCookie,
	updateUser,
	getCookie,
	generateUUID
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
		switchMap(async () => {
			let userID = getCookie('gs_userid')
			if (userID === '' || userID === 'undefined') {
				userID = generateUUID(window.navigator.userAgent)
			}
			let data = JSON.stringify({ userID })
			let errorMsg = ''
			return await fetch(
				`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/user`,
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
					user => userLoginSuccess(user),
					error => userLoginError(`Unable to login, ${errorMsg}`)
				)
		})
	)

//Update the cookie for the user.
export const userUpdateCookieEpic = action$ =>
	action$.pipe(
		ofType('USER_LOGIN_SUCCESS'),
		map(async action => {
			await updateCookie(action.user.userid)
		}),
		ignoreElements()
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
		map(state$ => ({ scores: state$[0].data, user: state$[1].user })),
		map(data => {
			let scores = {}
			let userScores = _.find(data.scores, score => {
				return score.userid === data.user.userID
			})
			if (!_.isUndefined(scores)) {
				scores.totalScore = userScores.totalscore
				scores.score = userScores.score
				scores.correct = userScores.correct
			} else {
				scores.totalScore = data.state.user.totalScore
				scores.score = data.state.user.score
				scores.correct = data.state.user.correct
			}
			return scores
		}),
		map(scores => userSetScore(scores))
	)

export const userDisplayScoreEpic = action$ =>
	action$.pipe(
		ofType('USER_SET_SCORE'),
		map(() => {
			const toast = document.getElementById('score-toast')
			toast.className = 'show'
			setTimeout(function() {
				toast.className = toast.className.replace('show', '')
			}, 3000)
		}),
		ignoreElements()
	)
