import { combineReducers } from 'redux'
import { userReducer } from './userReducer'
import { connectRouter } from 'connected-react-router'

export default history =>
	combineReducers({
		userReducer,
		router: connectRouter(history)
	})
