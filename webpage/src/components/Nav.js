import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import _ from 'lodash'
import '../styles/nav.css'

const Nav = props => {
	return (
		<nav className="fixed-bottom">
			<ul>
				<li>
					<Link to="/">PHONETRIVIA</Link>
				</li>
				<ul>
					<li
						style={
							_.isUndefined(props.score)
								? { display: 'none' }
								: {
										marginTop: '5px',
										color: 'lightslategray',
										textShadow: '2px 2px #0d1260'
								  }
						}
					>
						<h3>{props.score}</h3>
					</li>
					<li
						style={
							_.isNull(props.avatar)
								? { display: 'none' }
								: { padding: '0px', marginTop: '2.5px' }
						}
					>
						<img src={props.avatar} alt="avatar" className="avatar" />
					</li>
				</ul>
			</ul>
		</nav>
	)
}

export default withRouter(Nav)
