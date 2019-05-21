import { combineReducers } from 'redux'
import app from './appReducer'
import game from './gameReducer'
import host from './hostReducer'
import user from './userReducer'
import { connectRouter } from 'connected-react-router'

export default history =>
	combineReducers({
		app,
		game,
		host,
		user,
		router: connectRouter(history)
	})
