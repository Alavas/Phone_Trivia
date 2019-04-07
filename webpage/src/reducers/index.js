import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'
import user, {
	userDefaultAvatarEpic,
	userLoginEpic,
	userUpdateCookieEpic
} from './userReducer'
import { connectRouter } from 'connected-react-router'

export const rootEpic = combineEpics(
	userLoginEpic,
	userUpdateCookieEpic,
	userDefaultAvatarEpic
)

export default history =>
	combineReducers({
		user,
		router: connectRouter(history)
	})
