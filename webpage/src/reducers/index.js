import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import user, {
	userDefaultAvatarEpic,
	userLoginEpic,
	userUpdateCookieEpic,
	userWSScoreEpic
} from './userReducer'
import game, {
	gameJoinEpic,
	gameWebSocketEpic,
	gameWSGameEpic,
	gameWSScoresEpic,
	gameWSPlayersEpic,
	gameShowAnswerEpic,
	gameWSShowAnswerEpic
} from './gameReducer'
import { connectRouter } from 'connected-react-router'

export const rootEpic = combineEpics(
	gameJoinEpic,
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

export default history =>
	combineReducers({
		game,
		user,
		router: connectRouter(history)
	})
