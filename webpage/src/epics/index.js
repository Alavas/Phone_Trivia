import { combineEpics } from 'redux-observable'
import { appResetEpic, appErrorEpic, appDisplayErrorEpic } from './appEpics'
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
import {
	hostCreateGameEpic,
	hostNextQuestionEpic,
	hostQuestionEpic
} from './hostEpics'
import {
	userDefaultAvatarEpic,
	userDisplayScoreEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userWSScoreEpic
} from './userEpics'

export default combineEpics(
	appDisplayErrorEpic,
	appErrorEpic,
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
	hostNextQuestionEpic,
	hostQuestionEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userDefaultAvatarEpic,
	userDisplayScoreEpic,
	userWSScoreEpic
)
