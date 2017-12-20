"use strict" ;
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
console.log('Got inside here') ;

var util = require("util") ;

const data = require("../../data/urls.json") ;

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
	download: download,
	download_os_arch: download_os_arch
} ;

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function download(req, res) {
	console.log('Got inside download function') ;
	// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
	// {channel}/{os}/{dist}/{arch}
	let channel = req.swagger.params.channel.value || "LTS" ;
	let os = req.swagger.params.os.value || "linux" ;
	let dist = req.swagger.params.dist.value || "binary" ;
	let arch = req.swagger.params.arch.value ;

	let url = data[os][dist][arch] || null ;

	console.log(`url=${url}`);

	if(url === null) {
		console.log(`url was null`);
		res.type('json');               // => 'application/json'
		res.status(404).json({"message": "A distribution of this combination does not exist for Node.js"}) ;
	}

	res.redirect(url) ;
	// Redirect to the correct download
	// res.redirect('/foo/bar') ;

	// res.type('.html');              // => 'text/html'
	// res.type('html');               // => 'text/html'
	// res.type('json');               // => 'application/json'

	// res.status(404).json({"message": "A distribution of this combination does not exist for Node.js"}) ;
	// this sends back a JSON response which is a single string
}

function download_os_arch(req, res) {

}

console.log('Got end here') ;
