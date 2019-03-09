import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import _ from 'lodash'

const Nav = props => {
	return (
		<nav className="fixed-bottom">
			<ul>
				<li>
					<Link to="/">HOME</Link>
				</li>
				<ul>
					<li>PHONETRIVIA</li>
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

			<style jsx>{`
				:global(body) {
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Avenir Next,
						Avenir, Helvetica, sans-serif;
				}
				nav {
					z-index: 999;
					text-align: center;
					width: 100%;
					border-style: solid;
					border-width: 1px 0px 0px 0px;
					background-color: lightgrey !important;
					height: 65px !important;
				}
				ul {
					display: flex;
					justify-content: space-between;
				}
				nav > ul {
					position: relative;
					padding: 4px 16px;
				}
				li {
					display: flex;
					margin-top: 7.5px;
					padding: 6px 8px;
				}
				a {
					color: #212529;
					text-decoration: none;
					font-size: 1.5em;
					padding-right: 15px;
				}
				.avatar {
					vertical-align: middle;
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
			`}</style>
		</nav>
	)
}

export default withRouter(Nav)
