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
	gameWSPlayersEpic
} from './gameReducer'
import { connectRouter } from 'connected-react-router'

export const rootEpic = combineEpics(
	gameJoinEpic,
	gameWebSocketEpic,
	gameWSGameEpic,
	gameWSScoresEpic,
	gameWSPlayersEpic,
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
