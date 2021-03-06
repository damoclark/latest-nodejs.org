/*
 * app.js
 *
 * Main website router
 *
 * latest-nodejs.org
 *
 * 20/12/17
 *
 * Copyright (c) 2018 Damien Clark
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 *
 */

'use strict' ;

// wget --trust-server-names 'http://localhost:10010/download/lts/linux/binary/ARMv8'
// curl -L -O -J 'http://localhost:10010/download/lts/linux/binary/ARMv8'

const SwaggerExpress = require('swagger-express-mw') ;
const express = require('express') ;
const app = express() ;
const path = require('path') ;
const util = require('util') ;
const htmlToText = require('html-to-text') ;
const fromFile = util.promisify(htmlToText.fromFile) ;

// Add useragent parser
const useragent = require('express-useragent') ;
app.use(useragent.express()) ;

// Load home page according to user-agent type (command line or web browser)
// Note: this must precede app.use(express.static...) or will never be called
app.get('/', (req, res) => {

	// Determine user-agent
	let agent = req.useragent ;

	// if wget/curl then respond with plain text
	if(agent.isBot) {
		fromFile(__dirname + '/public/index.html', {
			wordwrap: 80
		})
		.then(text => {
			res.contentType('text/plain') ;
			res.send(text) ;
		}) ;
	}
	// otherwise, respond with html
	else {
		res.sendFile(__dirname + '/public/index.html') ;
	}
}) ;
// Add public directory for home page
let options = {
	dotfiles: 'ignore',
	extensions: ['html']
} ;
// Load other resources from under public directory
app.use(express.static(path.join(__dirname, 'public'), options)) ;

module.exports = app ; // for testing

let config = {
	appRoot: __dirname // required config
} ;

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) throw err ;

	// install middleware
	swaggerExpress.register(app) ;

	// Publish the swagger API documentation (swagger.ui) via /docs
	app.use(swaggerExpress.runner.swaggerTools.swaggerUi()) ;

	let port = process.env.PORT || 10010 ;
	let host = process.env.IP || 'localhost' ;
	app.listen(port, host) ;
}) ;
