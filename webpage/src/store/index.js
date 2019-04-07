import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createEpicMiddleware } from 'redux-observable'
import { createBrowserHistory } from 'history'
import createRootReducer, { rootEpic } from '../reducers'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

const epicMiddleware = createEpicMiddleware()

const logger = createLogger({
	collapsed: true
})

export const history = createBrowserHistory()

export default function configureStore() {
	const store = createStore(
		createRootReducer(history),
		compose(
			applyMiddleware(
				logger,
				routerMiddleware(history),
				thunk,
				epicMiddleware
			)
		)
	)
	epicMiddleware.run(rootEpic)

	return store
}
