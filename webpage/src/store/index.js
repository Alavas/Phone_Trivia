import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createRootReducer from '../reducers'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

const logger = createLogger({
	collapsed: true
})

export const history = createBrowserHistory()

export const store = createStore(
	createRootReducer(history),
	compose(applyMiddleware(logger, routerMiddleware(history), thunk))
)
