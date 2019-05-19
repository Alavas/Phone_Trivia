import { combineReducers } from 'redux'
import game from './gameReducer'
import host from './hostReducer'
import user from './userReducer'
import { connectRouter } from 'connected-react-router'

export default history =>
	combineReducers({
		game,
		host,
		user,
		router: connectRouter(history)
	})
