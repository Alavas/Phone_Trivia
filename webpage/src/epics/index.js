import { combineEpics } from 'redux-observable'
import { appResetEpic } from './appEpics'
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
import { hostCreateGameEpic } from './hostEpics'
import {
	userDefaultAvatarEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userWSScoreEpic
} from './userEpics'

export default combineEpics(
	appResetEpic,
	gameJoinEpic,
	gameEndEpic,
	gameWebSocketEpic,
	gameShowAnswerEpic,
	gameWSGameEpic,
	gameWSScoresEpic,
	gameWSPlayersEpic,
	gameWSShowAnswerEpic,
	hostCreateGameEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userDefaultAvatarEpic,
	userWSScoreEpic
)
