import React from 'react'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'

const Nav = () => (
	<nav className="fixed-bottom">
		<ul>
			<li>
				<Link prefetch href="/">
					<a>HOME</a>
				</Link>
			</li>
			<ul>
				<li>
					<Link href="https://github.com/alavas">
						<a className="align-middle">PHONETRIVIA</a>
					</Link>
				</li>
			</ul>
		</ul>

		<style jsx>{`
			:global(body) {
				margin: 0;
				font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
					Helvetica, sans-serif;
			}
			nav {
				z-index: 999;
				text-align: center;
				width: 100%;
				border-style: solid;
				border-width: 1px 0px 0px 0px;
				background-color: white !important;
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
				margin-top: 5px;
				padding: 6px 8px;
			}
			a {
				color: #212529;
				text-decoration: none;
				font-size: 1.5em;
				padding-right: 15px;
			}
		`}</style>
	</nav>
)

export default Nav
