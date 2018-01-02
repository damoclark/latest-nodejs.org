/*
 * download.js
 *
 * API handlers
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
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
const path = require('path') ;
const util = require('util') ;
const readcache = util.promisify(require('readcache')) ;

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
	download,
	download_os_arch,
	link_os_arch,
	download_source,
	link_source,
	link
} ;

async function downloader(channel, os, dist, arch) {
	let output = null ;
	try {
		let data = await readcache('./data/urls.json') ;
		data = JSON.parse(data) ;
		let url = data[channel] ;
		if(os !== undefined) {
			url = url[os] ;
			if(dist !== undefined) {
				url = url[dist] ;
				if(arch !== undefined) {
					url = url[arch] ;
				}
			}
		}
		else {
			url = url.source ;
		}
		if(url === undefined)
			throw new TypeError() ;
		let version = data[channel].latest.node ;
		let filename = path.basename(url) ;
		output = {url: url, filename: filename, version: version} ;
	}
	catch(err) {
		if(err instanceof TypeError) {
			let e = new Error('A distribution of this combination does not exist for Node.js') ;
			e.code = 404 ;
			throw e ;
		}
		// Otherwise some system-level error has occurred
		let e = new Error('An internal error has occurred') ;
		e.code = 500 ;
		throw e ;
	}
	return output ;
}

/*
  Functions in a127 controllers used for operations should take two parameters:

  Param 1: a handle to the request object
  Param 2: a handle to the response object
 */
function download(req, res) {
	// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
	// {channel}/{os}/{dist}/{arch}
	let channel = req.swagger.params.channel.value || 'lts' ;
	let os = req.swagger.params.os.value || 'linux' ;
	let dist = req.swagger.params.dist.value || 'binary' ;
	let arch = req.swagger.params.arch.value ;

	(async () => {
		try {
			let data = await downloader(channel, os, dist, arch) ;
			res.header('Content-Disposition', `attachment; filename=${data.filename}`) ;
			res.redirect(data.url) ;
		}
		catch(err) {
			console.warn(err) ;
			res.status(err.code) ;
			res.type('json') ;               // => 'application/json'
			res.json({'message': err.message}) ;
		}
	})() ;
}

function download_os_arch(req, res) {
	// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
	// {channel}/{os}/{dist}/{arch}
	let channel = 'lts' ;
	let os = req.swagger.params.os.value || 'linux' ;
	let dist = 'binary' ;
	let arch = req.swagger.params.arch.value ;

	(async () => {
		try {
			let data = await downloader(channel, os, dist, arch) ;
			res.header('Content-Disposition', `attachment; filename=${data.filename}`) ;
			res.redirect(data.url) ;
		}
		catch(err) {
			console.warn(err) ;
			res.status(err.code) ;
			res.type('json') ;               // => 'application/json'
			res.json({'message': err.message}) ;
		}
	})() ;
}

function link(req, res) {
	// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
	// {channel}/{os}/{dist}/{arch}
	let channel = req.swagger.params.channel.value || 'lts' ;
	let os = req.swagger.params.os.value || 'linux' ;
	let dist = req.swagger.params.dist.value || 'binary' ;
	let arch = req.swagger.params.arch.value ;

	(async () => {
		try {
			let data = await downloader(channel, os, dist, arch) ;
			res.status(200).json(data) ;
		}
		catch(err) {
			console.warn(err) ;
			res.status(err.code) ;
			res.type('json') ;               // => 'application/json'
			res.json({'message': err.message}) ;
		}
	})() ;
}

function link_os_arch(req, res) {
	// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
	// {channel}/{os}/{dist}/{arch}
	let channel = 'lts' ;
	let os = req.swagger.params.os.value || 'linux' ;
	let dist = 'binary' ;
	let arch = req.swagger.params.arch.value ;

	(async () => {
		try {
			let data = await downloader(channel, os, dist, arch) ;
			res.status(200).json(data) ;
		}
		catch(err) {
			console.warn(err) ;
			res.status(err.code) ;
			res.type('json') ;               // => 'application/json'
			res.json({'message': err.message}) ;
		}
	})() ;
}

function download_source(req, res) {
	// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
	// {channel}
	let channel = req.swagger.params.channel.value || 'lts' ;

	(async () => {
		try {
			let data = await downloader(channel) ;
			res.header('Content-Disposition', `attachment; filename=${data.filename}`) ;
			res.redirect(data.url) ;
		}
		catch(err) {
			console.warn(err) ;
			res.status(err.code) ;
			res.type('json') ;               // => 'application/json'
			res.json({'message': err.message}) ;
		}
	})() ;
}

function link_source(req, res) {
	// variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
	// {channel}
	let channel = req.swagger.params.channel.value || 'lts' ;

	(async () => {
		try {
			let data = await downloader(channel) ;
			res.status(200).json(data) ;
		}
		catch(err) {
			console.warn(err) ;
			res.status(err.code) ;
			res.type('json') ;               // => 'application/json'
			res.json({'message': err.message}) ;
		}
	})() ;
}
