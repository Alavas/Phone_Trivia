import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { userLogin } from '../actions/userActions'
import PhoneTrivia from '../images/PhoneTrivia.png'
import '../styles/nav.css'
import { resetApp } from '../actions/appActions'

const Nav = props => {
	useEffect(() => {
		props.login()
	}, [])
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
							_.isUndefined(props.user.score) || props.pathname === '/'
								? { display: 'none' }
								: {
										marginTop: '5px',
										color: 'lightslategray',
										textShadow: '2px 2px #0d1260'
								  }
						}
					>
						<h3>{props.user.score}</h3>
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
		</nav>
	)
}

const mapStateToProps = state => {
	return {
		pathname: state.router.location.pathname,
		user: state.user
	}
}

const mapDispatchToProps = dispatch => {
	return {
		login: () => dispatch(userLogin()),
		reset: () => dispatch(resetApp())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Nav)
