import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createEpicMiddleware } from 'redux-observable'
import { createBrowserHistory } from 'history'
import createRootReducer, { rootEpic } from '../reducers'
import thunk from 'redux-thunk'

const epicMiddleware = createEpicMiddleware()
export const history = createBrowserHistory()

const middlewares = [routerMiddleware(history), thunk, epicMiddleware]

if (process.env.NODE_ENV !== 'production') {
	const { createLogger } = require('redux-logger')
	const logger = createLogger({
		collapsed: true
	})
	middlewares.push(logger)
}

export default function configureStore() {
	const store = createStore(
		createRootReducer(history),
		compose(applyMiddleware(...middlewares))
	)
	epicMiddleware.run(rootEpic)

	return store
}
