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
	gameSubmitAnswerEpic,
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
	userUpdateAvatar,
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
	gameSubmitAnswerEpic,
	gameWSGameEpic,
	gameWSScoresEpic,
	gameWSPlayersEpic,
	gameWSShowAnswerEpic,
	hostCreateGameEpic,
	hostNextQuestionEpic,
	hostQuestionEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userUpdateAvatar,
	userDefaultAvatarEpic,
	userDisplayScoreEpic,
	userWSScoreEpic
)
