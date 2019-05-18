import { combineReducers } from 'redux'
import user from './userReducer'
import game from './gameReducer'
import { connectRouter } from 'connected-react-router'

export default history =>
	combineReducers({
		game,
		user,
		router: connectRouter(history)
	})
