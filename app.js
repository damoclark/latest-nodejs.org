'use strict' ;

// wget --trust-server-names 'http://localhost:10010/download/LTS/linux/binary/ARMv8'
// curl -L -O -J 'http://localhost:10010/download/LTS/linux/binary/ARMv8'

var SwaggerExpress = require('swagger-express-mw') ;
var app = require('express')() ;
module.exports = app ; // for testing

var config = {
	appRoot: __dirname // required config
} ;

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err)  throw err ; 

	// install middleware
	swaggerExpress.register(app) ;

	var port = process.env.PORT || 10010 ;
	app.listen(port) ;

	if (swaggerExpress.runner.swagger.paths['/hello']) 
		console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott') ;
  
}) ;
