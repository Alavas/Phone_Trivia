import React, { useEffect, useState, useRef } from 'react'
import { useTransition, animated } from 'react-spring'

//useInterval Dan Abramov's site-> https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback, delay) {
	const savedCallback = useRef()
	useEffect(() => {
		savedCallback.current = callback
	}, [callback])
	useEffect(() => {
		function tick() {
			savedCallback.current()
		}
		if (delay !== null) {
			let id = setInterval(tick, delay)
			return () => clearInterval(id)
		}
	}, [delay])
}

const CountdownTimer = props => {
	const items = [
		{ text: 'GO', key: 0 },
		{ text: '1', key: 1 },
		{ text: '2', key: 2 },
		{ text: '3', key: 3 },
		{ text: '4', key: 4 },
		{ text: '5', key: 5 },
		{ text: '6', key: 6 },
		{ text: '7', key: 7 },
		{ text: '8', key: 8 },
		{ text: '9', key: 9 },
		{ text: '10', key: 10 }
	]
	const initIndex = props.players > 1 ? 10 : 3
	const [index, setIndex] = useState(initIndex)
	const transitions = useTransition(items[index], item => item.key, {
		from: {
			transform: 'translate3d(0,-200px,0)',
			opacity: 0,
			zIndex: '-999'
		},
		enter: { transform: 'translate3d(0,0px,0)', opacity: 1, zIndex: 0 },
		leave: { transform: 'translate3d(0,200px,0)', opacity: 0, zIndex: 999 }
	})
	let interval = index >= 0 ? 1000 : null
	useInterval(() => {
		if (index > 0) {
			setIndex(state => state - 1)
		}
		if (index === 0 && props.host) {
			props.nextState()
		}
	}, interval)
	return (
		<div
			style={{
				position: 'relative',
				marginLeft: 'auto',
				marginRight: 'auto',
				height: '10rem',
				width: '100%',
				textAlign: 'center'
			}}
		>
			{transitions.map(({ item, props, key }) => {
				return (
					<animated.div key={key} style={props}>
						<h1
							style={{
								textShadow: 'none',
								color: 'white',
								fontSize: '10rem',
								position: 'absolute',
								lineHeight: '10rem',
								textAlign: 'center',
								width: '100%'
							}}
						>
							{item.text}
						</h1>
					</animated.div>
				)
			})}
		</div>
	)
}

export default CountdownTimer
