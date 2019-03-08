require('dotenv').config()
const webpack = require('webpack')
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
	distDir: 'build',
	webpack: config => {
		config.plugins.push(new webpack.EnvironmentPlugin(process.env))
		// Fixes npm packages that depend on `fs` module
		config.node = {
			fs: 'empty'
		}
		return config
	}
})
