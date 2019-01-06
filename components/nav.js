import React from 'react'
import Link from 'next/link'

const links = [{ href: 'https://github.com/alavas', label: 'PHONETRIVIA' }].map(
	link => {
		link.key = `nav-link-${link.href}-${link.label}`
		return link
	}
)

const Nav = () => (
	<nav>
		<ul>
			<li>
				<Link prefetch href="/">
					<a>HOME</a>
				</Link>
			</li>
			<ul>
				{links.map(({ key, href, label }) => (
					<li key={key}>
						<Link href={href}>
							<a>{label}</a>
						</Link>
					</li>
				))}
			</ul>
		</ul>

		<style jsx>{`
			:global(body) {
				margin: 0;
				font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
					Helvetica, sans-serif;
			}
			nav {
				position: absolute;
				bottom: 0px;
				z-index: 999;
				text-align: center;
				width: 100%;
				border-style: solid;
				border-width: 1px 0px 0px 0px;
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
				padding: 6px 8px;
			}
			a {
				color: #067df7;
				text-decoration: none;
				font-size: 13px;
			}
		`}</style>
	</nav>
)

export default Nav
