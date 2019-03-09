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
