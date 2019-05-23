import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { userLogin } from '../actions/userActions'
import PhoneTrivia from '../images/PhoneTrivia.png'
import '../styles/nav.css'
import { appReset } from '../actions/appActions'

const Nav = props => {
	useEffect(() => {
		props.login()
	}, [])
	//Dismiss the Error toast message.
	const hideError = () => {
		const errorToast = document.getElementById('error-toast')
		errorToast.className = errorToast.className.replace('show', 'hide')
	}
	return (
		<nav className="fixed-bottom">
			<ul>
				<li>
					{/*eslint-disable-next-line*/}
					<a className="phone-trivia" onClick={() => props.reset()}>
						<img src={PhoneTrivia} alt="PhoneTrivia" />
					</a>
				</li>
				<ul>
					<li
						style={
							_.isUndefined(props.user.totalScore) ||
							props.pathname === '/' ||
							!props.game.joined
								? { display: 'none' }
								: {
										marginTop: '5px',
										color: 'lightslategray',
										textShadow: '2px 2px #0d1260'
								  }
						}
					>
						<h3>{props.user.totalScore}</h3>
					</li>
					<li
						style={
							_.isNull(props.user.avatar) || props.user.avatar === ''
								? { display: 'none' }
								: { padding: '0px', marginTop: '2.5px' }
						}
					>
						<img
							src={props.user.avatar}
							alt="avatar"
							className="avatar"
						/>
					</li>
				</ul>
			</ul>
			<div id="error-toast" className="hide" onClick={() => hideError()}>
				{props.app.error}
			</div>
			<div
				id="score-toast"
				className="hide"
				style={
					props.user.score ? { color: 'limegreen' } : { color: 'crimson' }
				}
			>
				+{props.user.score}
			</div>
		</nav>
	)
}

const mapStateToProps = state => {
	return {
		pathname: state.router.location.pathname,
		app: state.app,
		user: state.user,
		game: state.game
	}
}

const mapDispatchToProps = dispatch => {
	return {
		login: () => dispatch(userLogin()),
		reset: () => dispatch(appReset())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Nav)
