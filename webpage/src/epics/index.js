import { combineEpics } from 'redux-observable'
import {
	userDefaultAvatarEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userWSScoreEpic
} from './userEpics'
import {
	gameJoinEpic,
	gameEndEpic,
	gameWebSocketEpic,
	gameWSGameEpic,
	gameWSScoresEpic,
	gameWSPlayersEpic,
	gameShowAnswerEpic,
	gameWSShowAnswerEpic
} from './gameEpics'

export default combineEpics(
	gameJoinEpic,
	gameEndEpic,
	gameWebSocketEpic,
	gameShowAnswerEpic,
	gameWSGameEpic,
	gameWSScoresEpic,
	gameWSPlayersEpic,
	gameWSShowAnswerEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userDefaultAvatarEpic,
	userWSScoreEpic
)
