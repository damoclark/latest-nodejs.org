'use strict' ;

// wget --trust-server-names 'http://localhost:10010/download/lts/linux/binary/ARMv8'
// curl -L -O -J 'http://localhost:10010/download/lts/linux/binary/ARMv8'

var SwaggerExpress = require('swagger-express-mw') ;
var express = require('express') ;
var app = express() ;
var path = require('path') ;
var util = require('util') ;
var htmlToText = require('html-to-text') ;
var fromFile = util.promisify(htmlToText.fromFile) ;

// Add useragent parser
var useragent = require('express-useragent') ;
app.use(useragent.express()) ;

// Load home page according to user-agent type (command line or web browser)
// Note: this must precede app.use(express.static...) or will never be called
app.get('/', (req, res) => {

	console.log('Got inside get /') ;
	// Determine user-agent
	let agent = req.useragent ;

	console.log(`agent=${util.inspect(agent)}`) ;

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
var options = {
	dotfiles: 'ignore',
	extensions: ['html']
} ;
// Load other resources from under public directory
app.use(express.static(path.join(__dirname, 'public'), options)) ;

module.exports = app ; // for testing

var config = {
	appRoot: __dirname // required config
} ;

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) throw err ;

	// install middleware
	swaggerExpress.register(app) ;

	// Publish the swagger API documentation (swagger.ui) via /docs
	app.use(swaggerExpress.runner.swaggerTools.swaggerUi()) ;

	var port = process.env.PORT || 10010 ;
	app.listen(port) ;

	if (swaggerExpress.runner.swagger.paths['/hello'])
		console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott') ;

}) ;
